import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: MessageStateTypes | {} = {};

const MessageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (_, action: PayloadAction<MessageStateTypes>) => {
      return action.payload;
    },
    clearMessages: () => {
      return initialState;
    },
  },
});

export { MessageSlice };
export const { setMessages, clearMessages } = MessageSlice.actions;
