import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatTypes[] = [];

const LatestChatSlice = createSlice({
  name: "latestChats",
  initialState,
  reducers: {
    appendLatestChat: (state, action: PayloadAction<ChatTypes>) => {
      return [...state, action.payload];
    },
    removeLatestChat: (state, action: PayloadAction<ChatTypes>) => {
      return state.filter((chat) => chat._id !== action.payload._id);
    },
    clearLatestChats: () => {
      return [];
    },
  },
});

export { LatestChatSlice };
export const { appendLatestChat, removeLatestChat, clearLatestChats } =
  LatestChatSlice.actions;
