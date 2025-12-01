import { Request } from "express";
import { Types } from "mongoose";
import { ChatTypes } from "./chat.js";

export interface RequestWithUser extends Request {
  userId?: string;
}

export interface UserTypes {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  username: string;
  password: string;
  bio?: string;
  avatar?: { public_id?: string; url?: string };
  chats: Types.ObjectId[] | ChatTypes[];
  requests: Types.ObjectId[] | UserTypes[];
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
