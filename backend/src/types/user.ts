import { Types } from "mongoose";
import { ChatTypes } from "./chat.js";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: UserTypes;
}

export interface UserTypes extends Document {
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
