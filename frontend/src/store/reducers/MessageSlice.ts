import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MessageStateTypes = {
  messages: [],
  hasMore: false,
};

const MessageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (_, action: PayloadAction<MessageStateTypes>) => {
      return action.payload;
    },
    appendMessage: (state, action: PayloadAction<MessageTypes>) => {
      state.messages = [...state.messages, action.payload];
    },
    removeMessage: (state, action: PayloadAction<MessageTypes>) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload._id
      );
    },
    clearMessages: () => {
      return initialState;
    },
  },
});

export { MessageSlice };
export const { setMessages, appendMessage, removeMessage, clearMessages } =
  MessageSlice.actions;
