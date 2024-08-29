import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
};

const ChatReducer = createSlice({
  name: "chats",
  initialState,
  reducers: {
    getChats: (state, action) => {
      state.chats = action.payload;
    },
    removeChats: (state) => {
      state.chats = [];
    },
  },
});

export default ChatReducer.reducer;
export const { getChats, removeChats } = ChatReducer.actions;
