import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { UserSlice } from "./reducers/UserSlice";
import { AuthSlice } from "./reducers/AuthSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [AuthSlice.name]: AuthSlice.reducer,
    [UserSlice.name]: UserSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
