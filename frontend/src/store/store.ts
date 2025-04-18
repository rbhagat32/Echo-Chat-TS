import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { AuthSlice } from "./reducers/AuthSlice";
import { UserSlice } from "./reducers/UserSlice";
import { ChatSlice } from "./reducers/ChatSlice";
import { MessageSlice } from "./reducers/MessageSlice";
import { ActiveChatSlice } from "./reducers/ActiveChatSlice";
// import { SearchSlice } from "./reducers/SearchSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [AuthSlice.name]: AuthSlice.reducer,
    [UserSlice.name]: UserSlice.reducer,
    [ChatSlice.name]: ChatSlice.reducer,
    [MessageSlice.name]: MessageSlice.reducer,
    [ActiveChatSlice.name]: ActiveChatSlice.reducer,
    // [SearchSlice.name]: SearchSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
