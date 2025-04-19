import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth } from "./reducers/AuthSlice";
import { setUser } from "./reducers/UserSlice";
import { setChats } from "./reducers/ChatSlice";
import { setMessages } from "./reducers/MessageSlice";
import { toast } from "sonner";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth", "User", "Chats", "Message"],

  endpoints: (builder) => ({
    checkLogin: builder.query<{ isLoggedIn: boolean }, void>({
      query: () => "auth/check",
      providesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.isLoggedIn));
        } catch (error) {
          toast.error("Failed to check login status. Please try again.");
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
          dispatch(setUser(data));
        } catch (error) {
          toast.error("Failed to fetch user data. Please try again.");
          console.error("Failed to fetch user:", error);
        }
      },
    }),

    getChats: builder.query<ChatTypes[], void>({
      query: () => "chat/get-chats",
      providesTags: ["Chats"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setChats(data));
        } catch (error) {
          toast.error("Failed to fetch chats. Please try again.");
          console.error("Failed to fetch chats:", error);
        }
      },
    }),

    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `chat/delete-chat/${chatId}`,
        method: "DELETE",
      }),
      async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          api.util.updateQueryData("getChats", undefined, (draft: any) => {
            return draft.filter((chat: any) => chat._id !== chatId);
          })
        );

        try {
          await queryFulfilled; // wait for API call to finish
        } catch {
          patchResult.undo(); // rollback if API fails
          toast.error("Failed to delete chat. Please try again later.");
        }
      },
    }),

    getMessages: builder.query<
      MessageStateTypes,
      { chatId: string; page?: number; limit?: number }
    >({
      query: ({
        chatId,
        page = 1,
        limit = -1, // limit = -1 means fetch all messages (default value)
      }) => `message/get-messages/${chatId}?page=${page}&limit=${limit}`,
      providesTags: ["Message"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMessages(data));
        } catch (error) {
          toast.error("Failed to fetch messages. Please try again.");
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
  useDeleteChatMutation,
  useLazyGetMessagesQuery,
} = api;
