import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (_, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export { AuthSlice };
export const { setAuth } = AuthSlice.actions;
