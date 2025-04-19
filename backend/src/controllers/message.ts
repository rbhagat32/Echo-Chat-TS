import { RequestWithUser } from "../types/user.js";
import { Response } from "express";
import chatModel from "../models/chat.js";
import messageModel from "../models/message.js";
import { MessageTypes } from "../types/message.js";

const sendMessage = async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Message must not be empty !" });
  }

  try {
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

    if (!newMessage) {
      return res.status(400).json({ message: "Error while sending message !" });
    }

    chat.messages.push(newMessage._id);
    await chat.save();

    return res.status(201).json({ message: "Message sent successfully !" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error !" });
  }
};

const getMessages = async (req: RequestWithUser, res: Response) => {
  const { chatId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;
  // treat limit = -1 as fetch all messages

  try {
    // ensure chat exists
    const chatExists = await chatModel.findById(chatId);
    if (!chatExists) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const totalMessages = await messageModel.countDocuments({ chatId });
    let getMessagesQuery = messageModel
      .find({ chatId })
      .sort({ createdAt: -1 }); // newest messages first

    if (limit !== -1) {
      getMessagesQuery = getMessagesQuery.skip((page - 1) * limit).limit(limit);
    }

    const messages: MessageTypes[] = await getMessagesQuery;

    const hasMore = limit !== -1 && page * limit < totalMessages;

    return res.status(200).json({
      messages,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const deleteMessage = async (req: RequestWithUser, res: Response) => {
  const { messageId } = req.params;

  try {
    const message = await messageModel.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found!" });
    }

    // remove deleted message from chat
    const chat = await chatModel.findById(message.chatId);
    chat.messages = chat.messages.filter(
      (id: string) => id.toString() !== messageId.toString()
    );
    await chat.save();

    return res.status(200).json({ message: "Message deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export { sendMessage, getMessages, deleteMessage };
