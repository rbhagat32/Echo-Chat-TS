import { MessageTypes } from "./message.js";
import { UserTypes } from "./user.js";

export interface ChatTypes {
  _id: string;
  users: UserTypes[];
  messages: MessageTypes[];
  createdAt: Date;
  updatedAt: Date;
}
