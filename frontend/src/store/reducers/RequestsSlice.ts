import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserTypes[] = [];

const RequestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: (_, action: PayloadAction<UserTypes[]>) => {
      return action.payload;
    },
    appendRequest: (state, action: PayloadAction<UserTypes>) => {
      return [...state, action.payload];
    },
    clearRequests: () => {
      return [];
    },
  },
});

export { RequestsSlice };
export const { setRequests, appendRequest, clearRequests } = RequestsSlice.actions;
