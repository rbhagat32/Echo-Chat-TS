import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { AuthSlice } from "./reducers/AuthSlice";
import { UserSlice } from "./reducers/UserSlice";
import { ChatSlice } from "./reducers/ChatSlice";
import { MiscSlice } from "./reducers/MiscSlice";
import { MessageSlice } from "./reducers/MessagesSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [AuthSlice.name]: AuthSlice.reducer,
    [UserSlice.name]: UserSlice.reducer,
    [ChatSlice.name]: ChatSlice.reducer,
    [MessageSlice.name]: MessageSlice.reducer,
    [MiscSlice.name]: MiscSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
