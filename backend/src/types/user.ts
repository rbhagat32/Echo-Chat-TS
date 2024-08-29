import { Request } from "express";
import { ChatTypes } from "./chat.js";

export interface RequestWithUser extends Request {
  user?: any;
}

export interface UserTypes {
  _id: string;
  username: string;
  password: string;
  bio: string;
  avatar: {
    public_id: string;
    url: string;
  };
  chats: ChatTypes[];
  requests: UserTypes[];
  matchPassword: (password: string) => Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
