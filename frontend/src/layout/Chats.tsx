import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetChatsQuery } from "../store/api";
import { toggleSideBar } from "../store/reducers/MiscSlice";
import Spinner from "../partials/Spinner";

const Chats = () => {
  const dispatch = useDispatch();
  const { isSideBarOpen } = useSelector((state: StateTypes) => state.misc);
  const { isLoading, data } = useGetChatsQuery();

  return (
    <div
      className={`${
        !isSideBarOpen ? "-left-52 lg:-left-80" : "left-0"
      } fixed w-52 lg:w-80 h-full overflow-auto bg-neutral-800 duration-300 ease-in-out z-[99]`}
    >
      <div className="relative top-20">
        {!isLoading ? (
          data?.length ? (
            data?.map((chat) => (
              <Link
                onClick={() => dispatch(toggleSideBar())}
                to={`/chat/${chat._id}`}
                key={chat._id}
                className="flex gap-2 items-center bg-zinc-700 hover:bg-indigo-500 mb-2 mx-2 p-3 rounded-lg duration-300 ease-in-out"
              >
                <div className="size-12 overflow-hidden rounded-full">
                  <img
                    src={chat.users[0].avatar.url || "/placeholder.jpeg"}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p>{chat.users[0].username}</p>
              </Link>
            ))
          ) : (
            <div className="mt-4">
              <p className="mx-auto w-fit text-lg">No Chats currently !</p>
            </div>
          )
        ) : (
          <div className="relative top-10">
            <Spinner size="size-10" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
