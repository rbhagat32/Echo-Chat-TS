/// <reference types="vite/client" />

interface UserTypes {
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
  createdAt: Date;
  updatedAt: Date;
}

interface ChatTypes {
  _id: string;
  users: UserTypes[];
  messages: MessageTypes[];
  createdAt: Date;
  updatedAt: Date;
}

interface MessageTypes {
  _id: string;
  chatId: ChatTypes;
  senderId: UserTypes;
  receiverId: UserTypes;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SignupFormData {
  username: string;
  password: string;
  bio: string;
  avatar: FileList;
}

interface LoginFormData {
  username: string;
  password: string;
}
