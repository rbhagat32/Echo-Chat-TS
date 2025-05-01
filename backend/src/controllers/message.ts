import { RequestWithUser } from "../types/user.js";
import { Response } from "express";
import chatModel from "../models/chat.js";
import messageModel from "../models/message.js";
import { MessageTypes } from "../types/message.js";
import { tryCatch } from "../utils/try-catch.js";
import { ErrorHandler } from "../middlewares/error-handler.js";

const sendMessage = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content) throw new ErrorHandler(400, "Message must not be empty !");

  const chat = await chatModel.findById(chatId);
  const senderId = req.user!.userId;
  const receiverId = chat.users
    .find((id: string) => id.toString() !== senderId.toString())
    .toString();

  const newMessage: MessageTypes = await messageModel.create({
    chatId,
    senderId,
    receiverId,
    content,
  });

  if (!newMessage) throw new ErrorHandler(400, "Error while sending message !");

  chat.messages.push(newMessage._id);
  await chat.save();

  return res.status(201).json({ message: "Message sent successfully !" });
});

const getMessages = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  // treat limit = -1 as fetch all messages

  // ensure chat exists
  const chatExists = await chatModel.findById(chatId);
  if (!chatExists) throw new ErrorHandler(404, "Chat not found !");

  const totalMessages = await messageModel.countDocuments({ chatId });
  let getMessagesQuery = messageModel.find({ chatId }).sort({ createdAt: -1 });

  if (limit !== -1) {
    getMessagesQuery = getMessagesQuery.skip((page - 1) * limit).limit(limit);
  }

  const messages: MessageTypes[] = await getMessagesQuery;

  const hasMore = limit !== -1 && page * limit < totalMessages;

  return res.status(200).json({
    messages: messages.reverse(),
    hasMore,
  });
});

const deleteMessage = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { messageId } = req.params;

  const message = await messageModel.findByIdAndDelete(messageId);
  if (!message) throw new ErrorHandler(404, "Message not found!");

  // remove deleted message from chat
  const chat = await chatModel.findById(message.chatId);
  if (!chat) throw new ErrorHandler(404, "Chat not found!");

  chat.messages = chat.messages.filter((id: string) => id.toString() !== messageId.toString());
  await chat.save();

  return res.status(200).json({ message: "Message deleted successfully!" });
});

export { sendMessage, getMessages, deleteMessage };
