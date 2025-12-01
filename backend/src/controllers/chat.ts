import { Response } from "express";
import { ErrorHandler } from "../middlewares/error-handler.js";
import { ChatModel } from "../models/chat.js";
import { MessageModel } from "../models/message.js";
import { UserModel } from "../models/user.js";
import { io, userSocketsMap } from "../socket.js";
import { ChatTypes } from "../types/chat.js";
import { RefetchTypes } from "../types/refetch.js";
import { RequestWithUser, UserTypes } from "../types/user.js";
import { tryCatch } from "../utils/try-catch.js";

const getChats = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { userId } = req;

  const user = await UserModel.findById(userId).populate({
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

  if (!user) throw new ErrorHandler(404, "User not found !");

  // remove the logged-in user from each chat's users array
  const chats = user.chats.map((chat: ChatTypes) => {
    const otherUsers = chat.users.filter((user) => user._id.toString() !== userId);

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
    const aTime = chat_a.messages[0]?.createdAt || new Date(0);
    const bTime = chat_b.messages[0]?.createdAt || new Date(0);
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  return res.status(200).json(chats);
});

const deleteChat = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const { userId } = req!;

  const chat = await ChatModel.findById(chatId);

  if (!chat) throw new ErrorHandler(404, "Chat doesn't exist !");

  const otherUserId = chat.users.find((id: string) => id.toString() !== userId);

  const [loggedInUser, otherUser] = await Promise.all([
    UserModel.findById(userId),
    UserModel.findById(otherUserId),
  ]);

  // delete all messages belonging to this chat
  for (let i = 0; i < chat.messages.length; i++) {
    await MessageModel.findOneAndDelete({ _id: chat.messages[i].toString() });
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
    ChatModel.findByIdAndDelete({ _id: chatId }),
    loggedInUser.save(),
    otherUser.save(),
  ]);

  // Emit refetch chats event to the other user
  const receiverSocketId = userSocketsMap.get(otherUserId.toString());
  if (receiverSocketId) {
    // send refetch event and send what to refetch
    io.to(receiverSocketId).emit("refetch", ["Chats"] as RefetchTypes[]);
  } else {
    // console.log(`Other user: ${otherUserId} is not online`);
  }

  return res.status(200).json({ message: "Chat deleted successfully!" });
});

export { deleteChat, getChats };
