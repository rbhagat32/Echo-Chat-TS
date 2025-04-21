import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth } from "./reducers/AuthSlice";
import { setUser } from "./reducers/UserSlice";
import { setChats } from "./reducers/ChatSlice";
import {
  appendMessage,
  removeMessage,
  setMessages,
} from "./reducers/MessageSlice";
import { toast } from "sonner";
import { Draft } from "@reduxjs/toolkit";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Auth", "User", "Chats", "Messages", "Searches", "Requests"],

  endpoints: (builder) => ({
    checkLogin: builder.query<{ isLoggedIn: boolean }, void>({
      query: () => "auth/check",
      providesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuth(data.isLoggedIn));
        } catch (error) {
          toast.error("Failed to check login status !");
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
          toast.error("Failed to fetch user data !");
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
          toast.error("Failed to fetch chats !");
          console.error("Failed to fetch chats:", error);
        }
      },
    }),

    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `chat/delete-chat/${chatId}`,
        method: "DELETE",
      }),
      // Optimistically update chats in the cache
      async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          // update the cache for the "getChats" query
          // undefined means no arguments for "getChats" query
          // we get access to the cached data and can modify it directly
          // remove the chat with the given chatId from the cache
          api.util.updateQueryData(
            "getChats",
            undefined,
            (chats: Draft<ChatTypes[]>) => {
              return chats.filter((chat: ChatTypes) => chat._id !== chatId);
            }
          )
        );

        try {
          await queryFulfilled; // wait for API call to finish
        } catch {
          patchResult.undo(); // rollback if API fails
          toast.error("Failed to delete chat !");
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
      providesTags: ["Messages"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setMessages(data));
        } catch (error) {
          toast.error("Failed to fetch messages !");
          console.error("Failed to fetch messages:", error);
        }
      },
    }),

    sendMessage: builder.mutation<void, MessageTypes>({
      query: (newMessage) => ({
        url: `message/send-message/${newMessage.chatId}`,
        method: "POST",
        body: { content: newMessage.content },
      }),
      // refetch chats after sending a message as it will update chats in order of latest message
      invalidatesTags: ["Chats"],

      // cannot perform optimistic update here because
      // when we do so, data in api gets updated.
      // but in messageContainer.tsx, we are fetching messages from store using useSelector
      // and not from api using useGetMessagesQuery
      // so we have to manualy update the store using dispatch

      // ❌
      // async onQueryStarted(newMessage, { dispatch, queryFulfilled }) {
      //   const patchResult = dispatch(
      //     api.util.updateQueryData(
      //       "getMessages",
      //       { chatId: newMessage.chatId },
      //       (draft: Draft<MessageStateTypes>) => {
      //         draft.messages.push(newMessage);
      //         draft.hasMore = false;
      //         return draft;
      //       }
      //     )
      //   );

      //   try {
      //     await queryFulfilled;
      //   } catch {
      //     patchResult.undo();
      //     toast.error("Failed to send message !");
      //   }
      // },

      // ✅
      async onQueryStarted(newMessage, { dispatch, queryFulfilled }) {
        // add the new message to the store optimistically
        dispatch(appendMessage(newMessage));

        try {
          await queryFulfilled;
        } catch (error) {
          // if the API call fails, remove the message from the store
          dispatch(removeMessage(newMessage));
          toast.error("Failed to send message !");
        }
      },
    }),

    searchUser: builder.query<UserTypes[], string>({
      query: (username) => `user/search-user?query=${username}`,
      providesTags: ["Searches"],
    }),

    sendRequest: builder.mutation<
      void,
      { userId: string; loggedInUserId: string; debouncedQuery: string }
    >({
      query: ({ userId }) => ({
        url: `user/send-request/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
      // Optimistically update user to whom request is sent
      async onQueryStarted(
        { userId, loggedInUserId, debouncedQuery },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          // update the cache for the "searchUser" query
          // original debouncedQuery is reqd as argument for "searchUser" query
          api.util.updateQueryData(
            "searchUser",
            debouncedQuery,
            (searches: Draft<UserTypes[]>) => {
              const targetUser = searches.find((u) => u._id === userId);
              if (targetUser) {
                // Add loggedInUserId to the requests array of tergetUser if not already present
                if (!targetUser.requests.includes(loggedInUserId)) {
                  targetUser.requests.push(loggedInUserId);
                }
              }

              return searches;
            }
          )
        );

        try {
          toast.success("Request sent successfully !");
          await queryFulfilled; // wait for API call to finish
        } catch {
          patchResult.undo(); // rollback if API fails
          toast.error("Failed to send request !");
        }
      },
    }),

    respondRequest: builder.mutation<
      void,
      { userId: string; response: string }
    >({
      query: ({ userId, response }) => ({
        url: `user/respond-request/${userId}?response=${response}`,
        method: "POST",
      }),
      async onQueryStarted({ response }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          if (response === "accept") {
            dispatch(api.util.invalidateTags(["User", "Chats", "Requests"]));
            toast.success("Request accepted successfully!");
          } else {
            dispatch(api.util.invalidateTags(["User", "Requests"]));
            toast.warning("Request rejected successfully!");
          }
        } catch (error) {
          toast.error("Failed to fetch chats !");
          console.error("Failed to fetch chats:", error);
        }
      },
    }),

    getRequests: builder.query<UserTypes[], void>({
      query: () => `user/get-requests`,
      providesTags: ["Requests"],
    }),
  }),
});

export const {
  useCheckLoginQuery,
  useGetUserQuery,
  useGetChatsQuery,
  useDeleteChatMutation,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useLazySearchUserQuery,
  useSendRequestMutation,
  useRespondRequestMutation,
  useGetRequestsQuery,
} = api;
