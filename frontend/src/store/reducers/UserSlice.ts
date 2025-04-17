import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserTypes | {} = {};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_, action: PayloadAction<UserTypes | {}>) => {
      return action.payload;
    },
    clearUser: () => {
      return {};
    },
  },
});

export { UserSlice };
export const { setUser, clearUser } = UserSlice.actions;
