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
    appendMessage: (state, action: PayloadAction<MessageTypes>) => {
      return { ...state, messages: [...state.messages, action.payload] };
    },
    removeMessage: (state, action: PayloadAction<MessageTypes>) => {
      const { _id } = action.payload;
      const result = state.messages.filter(
        (message: MessageTypes) => message._id !== _id
      );
      return { ...state, messages: result };
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
export const {
  setMessages,
  appendMessage,
  removeMessage,
  clearMessages,
  setMessagesLoading,
} = MessageSlice.actions;
