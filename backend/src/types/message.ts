import { Types } from "mongoose";
import { UserTypes } from "./user.js";
import { ChatTypes } from "./chat.js";

export interface MessageTypes  {
  _id: Types.ObjectId;
  chatId: Types.ObjectId | ChatTypes;
  senderId: Types.ObjectId | UserTypes;
  receiverId: Types.ObjectId | UserTypes;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
