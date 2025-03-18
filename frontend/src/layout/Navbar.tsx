import { HiBars3 } from "react-icons/hi2";
import { IoMdNotifications } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../store/api";
import { setAuth } from "../store/reducers/AuthSlice";
import { clearChats } from "../store/reducers/ChatSlice";
import { clearMessages } from "../store/reducers/MessagesSlice";
import { clearActiveChat, toggleSideBar } from "../store/reducers/MiscSlice";
import { clearUser } from "../store/reducers/UserSlice";
import axios from "../utils/axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        dispatch(clearChats());
        dispatch(clearUser());
        dispatch(clearMessages());
        dispatch(clearActiveChat());
      })
      .catch(() => {
        toast.error("Failed to logout !");
      });
  };

  const handleSearchButton = () => {
    navigate("/search");
    dispatch(clearActiveChat());
  };

  return (
    <div
      onClick={() => {
        if (isSideBarOpen) {
          dispatch(toggleSideBar());
        }
      }}
      className="z-50 w-full fixed px-2 py-2 flex justify-between"
    >
      <div className="flex gap-4 items-center">
        {!activeChat.chatId && (
          <button
            name="menu-icon"
            onClick={() => dispatch(toggleSideBar())}
            className="rounded-full text-3xl mt-0.5 border-2 p-1 duration-300 ease-in-out"
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
        <button onClick={handleSearchButton} className="text-3xl">
          <IoSearch />
        </button>

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
