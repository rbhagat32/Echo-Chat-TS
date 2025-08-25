import { RequestWithUser } from "../types/user.js";
import { Response } from "express";
import { ChatModel } from "../models/chat.js";
import { MessageModel } from "../models/message.js";
import { MessageTypes } from "../types/message.js";
import { tryCatch } from "../utils/try-catch.js";
import { ErrorHandler } from "../middlewares/error-handler.js";
import { io, userSocketsMap } from "../socket.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { FileProps } from "../types/file.js";

const sendMessage = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content) throw new ErrorHandler(400, "Message must not be empty !");

  const chat = await ChatModel.findById(chatId);
  const senderId = req.userId;
  const receiverId = chat.users.find((id: string) => id.toString() !== senderId).toString();

  const newMessage: MessageTypes = await MessageModel.create({
    chatId,
    senderId,
    receiverId,
    content,
  });

  if (!newMessage) throw new ErrorHandler(400, "Error while sending message !");

  chat.messages.push(newMessage._id);
  await chat.save();

  const receiverSocketId = userSocketsMap.get(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("realtime", newMessage);
  }

  return res.status(201).json({ message: "Message sent successfully !" });
});

const getMessages = tryCatch(async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  // treat limit = -1 as fetch all messages

  // ensure chat exists
  const chatExists = await ChatModel.findById(chatId);
  if (!chatExists) throw new ErrorHandler(404, "Chat not found !");

  const totalMessages = await MessageModel.countDocuments({ chatId });
  let getMessagesQuery = MessageModel.find({ chatId }).sort({ createdAt: -1 });

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

  const message = await MessageModel.findByIdAndDelete(messageId);
  if (!message) throw new ErrorHandler(404, "Message not found!");

  // remove deleted message from chat
  const chat = await ChatModel.findById(message.chatId);
  if (!chat) throw new ErrorHandler(404, "Chat not found!");

  chat.messages = chat.messages.filter((id: string) => id.toString() !== messageId.toString());
  await chat.save();

  // implement image deletion from Cloudinary when deleting message
  // if (isImageUrl(message.content)) {
  //   const publicId = message.content.split("/").pop().split(".")[0];
  //   await deleteFromCloudinary(publicId);
  // }

  return res.status(200).json({ message: "Message deleted successfully!" });
});

const uploadImage = tryCatch(async (req: RequestWithUser, res: Response) => {
  const image = req.file;
  const { public_id, url } = await uploadToCloudinary(image as FileProps);

  res.status(200).json({ message: "Image uploaded successfully !", imageUrl: url, public_id });
});

export { sendMessage, getMessages, deleteMessage, uploadImage };
