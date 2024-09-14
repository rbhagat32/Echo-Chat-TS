import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth } from "./reducers/AuthSlice";
import { setUsers } from "./reducers/UserSlice";
import { setChats } from "./reducers/ChatSlice";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth", "User", "Chat"],

  endpoints: (builder) => ({
    checkLogin: builder.query<{ isLoggedIn: boolean }, void>({
      query: () => "auth/check",
      providesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.isLoggedIn));
        } catch (error) {
          console.error("Failed to check login:", error);
        }
      },
    }),

    getUser: builder.query<UserTypes, void>({
      query: () => "user/get-user",
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      },
    }),

    getChats: builder.query<ChatTypes[], void>({
      query: () => "chat/get-chats",
      providesTags: ["Chat"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setChats(data));
        } catch (error) {
          console.error("Failed to fetch chats:", error);
        }
      },
    }),
  }),
});

export const { useCheckLoginQuery, useGetUserQuery, useGetChatsQuery } = api;
