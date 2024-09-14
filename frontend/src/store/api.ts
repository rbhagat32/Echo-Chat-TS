import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth } from "./reducers/AuthSlice";
import { setUsers } from "./reducers/UserSlice";
import { setChats } from "./reducers/ChatSlice";
import { setMessages } from "./reducers/MessagesSlice";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth", "User", "Chat", "Message"],

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

    getMessages: builder.query<
      MessageStateTypes,
      { chatId: string | undefined; page: number; limit: number }
    >({
      query: ({ chatId, page = 1, limit = 10 }) =>
        `message/get-messages/${chatId}?page=${page}&limit=${limit}`,
      providesTags: ["Message"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMessages(data));
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      },
    }),
  }),
});

export const {
  useCheckLoginQuery,
  useGetUserQuery,
  useGetChatsQuery,
  useGetMessagesQuery,
} = api;
