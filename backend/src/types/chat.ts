import { Types } from "mongoose";
import { MessageTypes } from "./message.js";
import { UserTypes } from "./user.js";

export interface ChatTypes {
  _id: Types.ObjectId;
  users: Types.ObjectId[] | UserTypes[];
  messages: Types.ObjectId[] | MessageTypes[];
  createdAt: Date;
  updatedAt: Date;
}
