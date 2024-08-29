import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const UserReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state) => {
      state.user = {};
    },
  },
});

export default UserReducer.reducer;
export const { getUser, removeUser } = UserReducer.actions;
