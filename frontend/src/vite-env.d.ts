/// <reference types="vite/client" />

interface StateTypes {
  auth: boolean;
  user: UserTypes;
  chats: ChatTypes[];
  messages: MessageStateTypes;
  searchedUsers: UserTypes[];
  misc: MiscTypes;
}

interface UserTypes {
  _id: string;
  username: string;
  bio: string;
  avatar: {
    public_id: string | null;
    url: string | null;
  };
  chats: string[];
  requests: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatTypes {
  _id: string;
  users: UserTypes[];
  createdAt: Date;
  updatedAt: Date;
}

interface MessageStateTypes {
  messages: MessageTypes[];
  hasMore: boolean;
}

interface MessageTypes {
  _id?: string;
  chatId?: string;
  senderId?: string;
  receiverId?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MiscTypes {
  isSideBarOpen: boolean;
  activeChat: {
    chatId: string;
    userId: string;
    username: string;
    avatar: string;
    bio: string;
  };
}
