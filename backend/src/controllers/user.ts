import { RequestWithUser } from "../types/user.js";
import { Response } from "express";
import { UserModel } from "../models/user.js";
import { ChatModel } from "../models/chat.js";
import { ChatTypes } from "../types/chat.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import { FileProps } from "../types/file.js";
import { io, userSocketsMap } from "../socket.js";
import { RefetchTypes } from "../types/refetch.js";
import { tryCatch } from "../utils/try-catch.js";
import { ErrorHandler } from "../middlewares/error-handler.js";

const getUser = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;

  const user = await UserModel.findById(userId);
  if (!user) throw new ErrorHandler(404, "User not found !");

  return res.status(200).json(user);
});

const searchUser = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;
  const { query } = req.query;

  const users = await UserModel.find({
    _id: { $ne: userId },
    username: { $regex: query, $options: "i" },
  });

  return res.status(200).json(users);
});

const sendRequest = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { id } = req.params;
  const { userId } = req;

  if (id === userId) throw new ErrorHandler(400, "You cannot send request to yourself !");

  const [loggedInUser, otherUser] = await Promise.all([
    UserModel.findById(userId),
    UserModel.findById(id),
  ]);

  if (!loggedInUser || !otherUser) throw new ErrorHandler(404, "User not found !");

  if (otherUser.requests.includes(userId))
    throw new ErrorHandler(400, `Your Request is still Pending with ${otherUser.username} !`);

  if (loggedInUser.requests.includes(id))
    throw new ErrorHandler(400, `You already have a Pending request from ${otherUser.username} !`);

  // check if both users are already connected
  if (otherUser.chats.some((chat: ChatTypes) => loggedInUser.chats.includes(chat)))
    throw new ErrorHandler(400, `You are already connected with ${otherUser.username} !`);

  otherUser.requests.push(userId);
  await otherUser.save();

  return res.status(200).json({ message: "Request Sent Successfully !" });
});

const getRequests = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;

  const user = await UserModel.findById(userId).populate("requests");
  if (!user) throw new ErrorHandler(404, "User not found !");

  return res.status(200).json(user.requests);
});

const respondRequest = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;
  const { id } = req.params;
  const { response } = req.query;

  if (response !== "accept" && response !== "reject")
    throw new ErrorHandler(400, "Invalid response !");

  const [loggedInUser, otherUser] = await Promise.all([
    UserModel.findById(userId),
    UserModel.findById(id),
  ]);

  if (!loggedInUser || !otherUser) throw new ErrorHandler(404, "User not found !");

  if (!loggedInUser.requests.includes(id)) throw new ErrorHandler(400, "Request not found !");

  // request is accepted or rejected, in either case, remove the request from requests array of loggedInUser
  const requestIndex = loggedInUser.requests.indexOf(id);
  loggedInUser.requests.splice(requestIndex, 1);

  if (response === "accept") {
    // create new chat and put both users in it
    const newChat = await ChatModel.create({
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
      ] as RefetchTypes[]);

    if (response === "reject")
      io.to(receiverSocketId).emit("refetch", ["User", "Searches", "Requests"] as RefetchTypes[]);
  } else {
    // console.log(`Other user: ${otherUserId} is not online`);
  }

  return res.status(200).json({ message: `Request ${response}ed Successfully !` });
});

const updateDetails = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;
  const { bio } = req.body;
  const avatar = req.file;

  if (!bio && !avatar)
    throw new ErrorHandler(400, "Please provide at least a bio or an avatar to update !");

  if (bio && bio.trim().length > 50)
    throw new ErrorHandler(400, "Bio must be less than 50 characters !");

  const user = await UserModel.findById(userId);
  if (!user) throw new ErrorHandler(404, "User not found !");

  if (bio.trim()) user.bio = bio;

  if (avatar) {
    deleteFromCloudinary(user.avatar.public_id);
    const { public_id, url } = await uploadToCloudinary(avatar as FileProps);
    user.avatar.public_id = public_id;
    user.avatar.url = url;
  }

  await user.save();

  return res.status(200).json({ message: "Details Updated Successfully !" });
});

const deleteBio = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;

  const user = await UserModel.findById(userId);
  if (!user) throw new ErrorHandler(404, "User not found !");

  user.bio = "";
  await user.save();

  return res.status(200).json({ message: "Bio Removed Successfully !" });
});

const deleteAvatar = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;

  const user = await UserModel.findById(userId);
  if (!user) throw new ErrorHandler(404, "User not found !");

  deleteFromCloudinary(user.avatar.public_id);
  user.avatar.public_id = null;
  user.avatar.url = null;
  await user.save();

  return res.status(200).json({ message: "Avatar Removed Successfully !" });
});

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
