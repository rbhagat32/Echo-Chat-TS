import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MessageStateTypes | {} = {};

const MessageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MessageStateTypes | {}>) => {
      return { ...state, ...action.payload };
    },
    clearMessages: () => {
      return initialState;
    },
    setMessagesLoading: (state, action) => {
      state.isMessagesLoading = action.payload;
    },
  },
});

export { MessageSlice };
export const { setMessages, clearMessages, setMessagesLoading } =
  MessageSlice.actions;
