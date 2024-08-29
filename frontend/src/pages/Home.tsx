import { useGetUser } from "../hooks/useGetUser";
import { useGetChats } from "../hooks/useGetChats";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import TopBar from "../components/TopBar";
import ChatSkeleton from "../partials/ChatSkeleton";

export default function Home() {
  return (
    <div className="w-full h-screen flex">
      <Chats />
      <Messages />
    </div>
  );
}

const Chats = () => {
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
            <Link
              to={""}
              key={chat._id}
              className="mb-2 flex items-center gap-5 bg-backgroundLight hover:bg-indigo-500 px-5 py-3 rounded-lg duration-300 ease-in-out"
            >
              <div className="size-16 rounded-full overflow-hidden">
                <img
                  src={chat?.users[0]?.avatar?.url || "/user-placeholder.png"}
                  className="w-full h-full object-cover"
                  alt="User Avatar"
                />
              </div>
              <h1 className="text-lg">{chat?.users[0]?.username}</h1>
            </Link>
          ))
        ) : (
          <h1>Search users to get started!</h1>
        )}
      </div>
    </div>
  );
};

const Messages = () => {
  const { loading, user } = useGetUser();

  return (
    !loading && (
      <div className="h-screen overflow-auto hidden md:block md:w-[60%] lg:w-[70%] bg-background md:border-l border-neutral-700">
        <TopBar user={user as UserTypes} />

        <div className="px-5 mt-3"></div>
      </div>
    )
  );
};
