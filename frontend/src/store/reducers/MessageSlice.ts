import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MessageStateTypes = {
  messages: [],
  hasMore: false,
  isMessagesLoading: false,
};

const MessageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<MessageStateTypes>) => {
      return { ...state, ...action.payload };
    },
    clearMessages: () => {
      return initialState;
    },
    setMessagesLoading: (
      state: MessageStateTypes,
      action: PayloadAction<boolean>
    ) => {
      state.isMessagesLoading = action.payload;
    },
  },
});

export { MessageSlice };
export const { setMessages, clearMessages, setMessagesLoading } =
  MessageSlice.actions;
