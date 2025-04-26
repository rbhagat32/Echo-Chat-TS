import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: string[] = [];

const OnlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (_, action: PayloadAction<string[]>) => {
      return action.payload;
    },
    clearOnlineUsers: () => {
      return [];
    },
  },
});

export { OnlineUsersSlice };
export const { setOnlineUsers, clearOnlineUsers } = OnlineUsersSlice.actions;
