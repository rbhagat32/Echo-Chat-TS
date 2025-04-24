import { RequestWithUser } from "../types/user.js";
import { Response } from "express";
import userModel from "../models/user.js";
import chatModel from "../models/chat.js";
import { ChatTypes } from "../types/chat.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
import { FileProps } from "../types/file.js";
import { io, userSocketsMap } from "../socket.js";

const getUser = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(500).json({ message: "Unable to fetch data !" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const searchUser = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;
  const { query } = req.query;

  try {
    const users = await userModel.find({
      _id: { $ne: userId },
      username: { $regex: query, $options: "i" },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const sendRequest = async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user!;

  if (id === userId.toString()) {
    return res
      .status(400)
      .json({ message: "You cannot send request to yourself !" });
  }

  try {
    const [loggedInUser, otherUser] = await Promise.all([
      userModel.findById(userId),
      userModel.findById(id),
    ]);

    if (!loggedInUser || !otherUser) {
      return res.status(500).json({ message: "Unable to fetch data !" });
    }

    if (otherUser.requests.includes(userId)) {
      return res.status(400).json({ message: "Your Request is Pending" });
    }

    if (loggedInUser.requests.includes(id)) {
      return res.status(400).json({
        message: "You already have a Pending request from this User !",
      });
    }

    // check if both users are already connected
    if (
      otherUser.chats.some((chat: ChatTypes) =>
        loggedInUser.chats.includes(chat)
      )
    ) {
      return res.status(400).json({ message: "You are already connected !" });
    }

    otherUser.requests.push(userId);
    await otherUser.save();

    return res.status(200).json({ message: "Request Sent Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const getRequests = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;

  try {
    const user = await userModel.findById(userId).populate("requests");
    if (!user)
      return res.status(500).json({ message: "Unable to fetch data !" });

    return res.status(200).json(user.requests);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const respondRequest = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;
  const { id } = req.params;
  const { response } = req.query;

  if (response !== "accept" && response !== "reject") {
    return res.status(400).json({ message: "Invalid response !" });
  }

  try {
    const [loggedInUser, otherUser] = await Promise.all([
      userModel.findById(userId),
      userModel.findById(id),
    ]);

    if (!loggedInUser || !otherUser) {
      return res.status(500).json({ message: "Unable to fetch data !" });
    }

    if (!loggedInUser.requests.includes(id)) {
      return res.status(400).json({ message: "No Request Found !" });
    }

    // request is accepted or rejected, in either case, remove the request from requests array of loggedInUser
    const requestIndex = loggedInUser.requests.indexOf(id);
    loggedInUser.requests.splice(requestIndex, 1);

    if (response === "accept") {
      // create new chat and put both users in it
      const newChat = await chatModel.create({
        users: [userId, id],
        messages: [],
      });

      // push new chat to chats arrays of both users
      loggedInUser.chats.push(newChat._id);
      otherUser.chats.push(newChat._id);
      await Promise.all([loggedInUser.save(), otherUser.save()]);
    } else if (response === "reject") {
      // if request is rejected, just save the loggedInUser
      // as request has been already removed from requests array
      await loggedInUser.save();
    }

    // Emit refetch chats event to the other user
    const receiverSocketId = userSocketsMap.get(otherUser._id.toString());
    if (receiverSocketId) {
      // send refetch event and send what to refetch
      if (response === "accept")
        io.to(receiverSocketId).emit("refetch", [
          "User",
          "Chats",
          "Searches",
          "Requests",
        ]);

      if (response === "reject")
        io.to(receiverSocketId).emit("refetch", [
          "User",
          "Searches",
          "Requests",
        ]);
    } else {
      // console.log(`Other user: ${otherUserId} is not online`);
    }

    return res
      .status(200)
      .json({ message: `Request ${response}ed Successfully !` });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const updateDetails = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;
  const { bio } = req.body;
  const avatar = req.file;

  if (!bio && !avatar) {
    return res.status(400).json({
      message: "Please provide at least a bio or an avatar to update !",
    });
  }

  if (bio && bio.trim().length > 50)
    return res
      .status(400)
      .json({ message: "Bio must be less than 50 characters !" });

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(500).json({ message: "User does not exist !" });

    if (bio.trim()) user.bio = bio;

    if (avatar) {
      deleteFromCloudinary(user.avatar.public_id);
      const { public_id, url } = await uploadToCloudinary(avatar as FileProps);
      user.avatar.public_id = public_id;
      user.avatar.url = url;
    }

    await user.save();

    return res.status(200).json({ message: "Details Updated Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const deleteBio = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(500).json({ message: "User does not exist !" });

    user.bio = "";
    await user.save();

    return res.status(200).json({ message: "Bio Removed Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const deleteAvatar = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;

  try {
    const user = await userModel.findById(userId);
    if (!user)
      return res.status(500).json({ message: "User does not exist !" });

    deleteFromCloudinary(user.avatar.public_id);
    user.avatar.public_id = null;
    user.avatar.url = null;
    await user.save();

    return res.status(200).json({ message: "Avatar Removed Successfully !" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

export {
  getUser,
  searchUser,
  sendRequest,
  getRequests,
  respondRequest,
  updateDetails,
  deleteBio,
  deleteAvatar,
};
