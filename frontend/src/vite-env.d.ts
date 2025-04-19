/// <reference types="vite/client" />

interface StateTypes {
  auth: boolean;
  user: UserTypes;
  chats: ChatTypes[];
  activeChat: ChatTypes;
  messages: MessageStateTypes;
  // searchedUsers: UserTypes[];
}

interface UserTypes {
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

interface ChatTypes {
  _id: Types.ObjectId;
  users: Types.ObjectId[] | UserTypes[];
  messages: Types.ObjectId[] | MessageTypes[];
  createdAt: Date;
  updatedAt: Date;
}

interface MessageStateTypes {
  messages: MessageTypes[];
  hasMore: boolean;
  isMessagesLoading: boolean;
}

interface MessageTypes {
  _id: Types.ObjectId;
  chatId: Types.ObjectId | ChatTypes;
  senderId: Types.ObjectId | UserTypes;
  receiverId: Types.ObjectId | UserTypes;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
