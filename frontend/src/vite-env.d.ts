/// <reference types="vite/client" />

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

interface ChatTypes {}
