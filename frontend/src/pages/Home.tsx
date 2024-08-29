import Loader from "../partials/Loader";
import { useGetUser } from "../hooks/useGetUser";
import { useGetChats } from "../hooks/useGetChats";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const { loading, user } = useGetUser();

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full h-screen flex">
      <Chats />
      <Messages />
    </div>
  );
}

const Chats = () => {
  const { loading, chats } = useGetChats();

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full md:w-[40%] lg:w-[30%]">
      <SearchBar />

      <div className="px-5">
        <h1 className="font-semibold text-4xl mb-3">Chats :</h1>
        {chats.map((chat: ChatTypes) => (
          <Link
            to={""}
            key={chat._id}
            className="mb-1.5 flex items-center gap-5 bg-backgroundLight hover:bg-indigo-500 px-5 py-3 rounded-lg duration-300 ease-in-out"
          >
            <div className="size-16 rounded-full overflow-hidden">
              <img
                src={chat?.users[0]?.avatar?.url || "/user-placeholder.png"}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-lg">{chat?.users[0]?.username}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Messages = () => {
  return (
    <div className="hidden md:block md:w-[60%] lg:w-[70%] bg-background md:border-l border-neutral-600">
      Messages
    </div>
  );
};
