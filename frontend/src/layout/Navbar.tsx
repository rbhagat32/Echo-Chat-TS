import { HiBars3 } from "react-icons/hi2";
import { IoMdNotifications } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { api } from "../store/api";
import { setAuth } from "../store/reducers/AuthSlice";
import { setChats } from "../store/reducers/ChatSlice";
import { setMessages } from "../store/reducers/MessagesSlice";
import { setActiveChat, toggleSideBar } from "../store/reducers/MiscSlice";
import { setUsers } from "../store/reducers/UserSlice";
import axios from "../utils/axios";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isSideBarOpen, activeChat } = useSelector(
    (state: StateTypes) => state.misc
  );

  const logout = () => {
    axios
      .get("/auth/logout")
      .then(() => {
        toast.success("Logged out successfully !");
        dispatch(setAuth(false));
        dispatch(api.util.invalidateTags(["Auth"]));
        dispatch(setChats([]));
        dispatch(setUsers({}));
        dispatch(setMessages({}));
        dispatch(setActiveChat({}));
      })
      .catch(() => {
        toast.error("Failed to logout !");
      });
  };

  return (
    <div
      onClick={() => {
        if (isSideBarOpen) {
          dispatch(toggleSideBar());
        }
      }}
      className="w-full fixed px-2 py-2 flex justify-between"
    >
      <div className="flex gap-4 items-center">
        {!activeChat.chatId && (
          <button
            onClick={() => dispatch(toggleSideBar())}
            className="rounded-full text-3xl border-2 p-1 duration-300 ease-in-out"
          >
            <HiBars3 />
          </button>
        )}

        {activeChat.chatId ? (
          <div className="flex gap-4 items-center">
            <div
              onClick={() => dispatch(toggleSideBar())}
              className="overflow-hidden size-12 rounded-full border-2 cursor-pointer"
            >
              <img
                src={activeChat.avatar || "/placeholder.jpeg"}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-semibold">{activeChat.username}</h1>
          </div>
        ) : (
          <h1 className="text-3xl font-bold">
            Echo
            <span className="inline-block ml-0.5 size-1.5 bg-indigo-400 rounded-full"></span>
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link to={"/search"} className="text-3xl">
          <IoSearch />
        </Link>

        <button className="relative text-3xl">
          <span className="absolute top-0 right-0 block size-1.5 bg-green-500 rounded-full"></span>
          <IoMdNotifications />
        </button>

        <button onClick={logout} className="relative text-3xl">
          <TbLogout2 />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
