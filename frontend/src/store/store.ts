import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { AuthSlice } from "./reducers/AuthSlice";
import { UserSlice } from "./reducers/UserSlice";
import { ChatSlice } from "./reducers/ChatSlice";
import { ActiveChatSlice } from "./reducers/ActiveChatSlice";
import { LatestChatSlice } from "./reducers/LatestChatSlice";
import { MessageSlice } from "./reducers/MessageSlice";
import { RequestsSlice } from "./reducers/RequestsSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [AuthSlice.name]: AuthSlice.reducer,
    [UserSlice.name]: UserSlice.reducer,
    [ChatSlice.name]: ChatSlice.reducer,
    [ActiveChatSlice.name]: ActiveChatSlice.reducer,
    [LatestChatSlice.name]: LatestChatSlice.reducer,
    [MessageSlice.name]: MessageSlice.reducer,
    [RequestsSlice.name]: RequestsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
