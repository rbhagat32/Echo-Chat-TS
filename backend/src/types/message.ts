import { ChatTypes } from "./chat.js";
import { UserTypes } from "./user.js";

export interface MessageTypes {
  _id: string;
  chatId: ChatTypes;
  senderId: UserTypes;
  receiverId: UserTypes;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
