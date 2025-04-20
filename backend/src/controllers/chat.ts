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
      populate: [
        {
          // Populate the users inside each chat
          path: "users",
        },
        {
          // Populate the messages inside each chat
          path: "messages",
          // sort messages by createdAt in descending order and populate only the latest message
          options: { sort: { createdAt: -1 }, limit: 1 },
        },
      ],
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

    type PopulatesChatTypes = {
      _id: string;
      user: UserTypes;
      // messages array will contain only 1 latest message
      messages: {
        _id: string;
        chatId: string;
        senderId: string;
        receiverId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
    };

    // Comparator - sort chats by latest message timestamp
    chats.sort((chat_a: PopulatesChatTypes, chat_b: PopulatesChatTypes) => {
      const aTime = chat_a.messages[0].createdAt;
      const bTime = chat_b.messages[0].createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return res.status(200).json(chats);
  } catch (error) {
    console.error(error);
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
