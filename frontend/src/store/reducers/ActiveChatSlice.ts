import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatTypes | {} = {};

const ActiveChatSlice = createSlice({
  name: "activeChat",
  initialState,
  reducers: {
    setActiveChat: (_, action: PayloadAction<ChatTypes | {}>) => {
      return action.payload;
    },
    clearActiveChat: () => {
      return {};
    },
  },
});

export { ActiveChatSlice };
export const { setActiveChat, clearActiveChat } = ActiveChatSlice.actions;
