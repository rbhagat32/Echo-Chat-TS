import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null as UserTypes | null,
};

const UserReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
  },
});

export default UserReducer.reducer;
export const { getUser, removeUser } = UserReducer.actions;
