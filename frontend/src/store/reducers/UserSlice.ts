import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserTypes | {} = {};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (_, action: PayloadAction<UserTypes>) => {
      return action.payload;
    },
  },
});

export { UserSlice };
export const { setUsers } = UserSlice.actions;
