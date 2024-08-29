import { configureStore } from "@reduxjs/toolkit";
import ChatReducer from "./reducers/ChatReducer";
import UserReducer from "./reducers/UserReducer";

export const store = configureStore({
  reducer: {
    UserReducer,
    ChatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
