import { Types } from "mongoose";
import { UserTypes } from "./user.js";
import { MessageTypes } from "./message.js";

export interface ChatTypes {
  _id: Types.ObjectId;
  users: Types.ObjectId[] | UserTypes[];
  messages: Types.ObjectId[] | MessageTypes[];
  createdAt: Date;
  updatedAt: Date;
}
