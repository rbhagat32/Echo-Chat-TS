import { useGetUser } from "../hooks/useGetUser";
import { useGetChats } from "../hooks/useGetChats";
import SearchBar from "../components/SearchBar";
import TopBar from "../components/TopBar";
import ChatSkeleton from "../partials/ChatSkeleton";
import MessageContainer from "../components/MessageContainer";
import { useState } from "react";
import SelectChat from "../components/SelectChat";
import PageLoader from "../partials/PageLoader";

export default function Home() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="w-full h-screen flex">
      <Chats selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      <Messages selectedChat={selectedChat} />
    </div>
  );
}

const Chats = ({ selectedChat, setSelectedChat }: any) => {
  const { loading, chats } = useGetChats();

  return loading ? (
    <ChatSkeleton />
  ) : (
    <div className="h-screen overflow-auto w-full md:w-[40%] lg:w-[30%]">
      <SearchBar />

      <div className="px-5">
        <h1 className="font-semibold text-4xl mb-3">Chats</h1>
        {chats.length > 0 ? (
          chats.map((chat: ChatTypes) => (
            <div
              onClick={() => setSelectedChat(chat._id)}
              key={chat._id}
              className={`mb-2 flex items-center gap-5 ${
                selectedChat === chat._id
                  ? "bg-indigo-500"
                  : "bg-backgroundLight hover:bg-neutral-700/60"
              } cursor-pointer px-5 py-3 rounded-lg duration-300 ease-in-out`}
            >
              <div className="size-16 rounded-full overflow-hidden">
                <img
                  src={chat?.users[0]?.avatar?.url || "/user-placeholder.png"}
                  className="w-full h-full object-cover"
                  alt="User Avatar"
                />
              </div>
              <h1 className="text-lg">{chat?.users[0]?.username}</h1>
            </div>
          ))
        ) : (
          <h1>Search users to get started!</h1>
        )}
      </div>
    </div>
  );
};

const Messages = ({ selectedChat }: any) => {
  const { loading, user } = useGetUser();

  return loading ? (
    <PageLoader />
  ) : (
    <div className="h-screen overflow-hidden hidden md:block md:w-[60%] lg:w-[70%] bg-background md:border-l border-neutral-700">
      <TopBar user={user as UserTypes} />

      <div className="h-[90vh] px-5 py-3">
        {selectedChat ? (
          <MessageContainer
            loggedInUser={user as UserTypes}
            chatId={selectedChat}
          />
        ) : (
          <SelectChat />
        )}
      </div>
    </div>
  );
};
