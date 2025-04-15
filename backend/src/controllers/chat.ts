import { Response } from "express";
import { RequestWithUser, UserTypes } from "../types/user.js";
import userModel from "../models/user.js";
import chatModel from "../models/chat.js";
import messageModel from "../models/message.js";
import { ChatTypes } from "../types/chat.js";

const getChats = async (req: RequestWithUser, res: Response) => {
  const { userId } = req.user!;

  try {
    const user = await userModel.findById(userId).populate({
      path: "chats",
      select: "-messages",
      populate: {
        path: "users", // Populate the users inside each chat
      },
    });

    if (!user) {
      return res.status(500).json({ message: "Unable to fetch data!" });
    }

    // remove the logged-in user from each chat's users array
    const chats = user.chats.map((chat: ChatTypes) => {
      const otherUsers = chat.users.filter(
        (user) => user._id.toString() !== userId.toString()
      );

      chat.users = otherUsers as UserTypes[];
      return chat;
    });

    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteChat = async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const { userId } = req.user!;

  try {
    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat doesn't exist!" });
    }

    const otherUserId = chat.users.find(
      (id: string) => id.toString() !== userId.toString()
    );

    const [loggedInUser, otherUser] = await Promise.all([
      userModel.findById(userId),
      userModel.findById(otherUserId),
    ]);

    // delete all messages belonging to this chat
    for (let i = 0; i < chat.messages.length; i++) {
      await messageModel.findOneAndDelete({ _id: chat.messages[i].toString() });
    }

    // remove chat from loggedInUser
    loggedInUser.chats = loggedInUser.chats.filter(
      (chat: ChatTypes) => chat.toString() !== chatId.toString()
    );

    // remove chat from otherUser
    otherUser.chats = otherUser.chats.filter(
      (chat: ChatTypes) => chat.toString() !== chatId.toString()
    );

    // delete chat and save changes
    await Promise.all([
      chatModel.findByIdAndDelete({ _id: chatId }),
      loggedInUser.save(),
      otherUser.save(),
    ]);

    return res.status(200).json({ message: "Chat deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export { getChats, deleteChat };
