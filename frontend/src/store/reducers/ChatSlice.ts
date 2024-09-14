import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatTypes[] = [];

const ChatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (_, action: PayloadAction<ChatTypes[]>) => {
      return action.payload;
    },
  },
});

export { ChatSlice };
export const { setChats } = ChatSlice.actions;
