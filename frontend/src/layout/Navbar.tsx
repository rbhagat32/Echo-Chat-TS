import { HiBars3 } from "react-icons/hi2";
import { IoMdNotifications } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { api } from "../store/api";
import { setAuth } from "../store/reducers/AuthSlice";
import { toggleSideBar } from "../store/reducers/MiscSlice";
import axios from "../utils/axios";
import { setChats } from "../store/reducers/ChatSlice";
import { setUsers } from "../store/reducers/UserSlice";
import { setMessages } from "../store/reducers/MessagesSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isSideBarOpen } = useSelector((state: StateTypes) => state.misc);

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
      className="w-full fixed px-2 py-4 flex justify-between"
    >
      <div className="flex gap-4 items-center">
        <button
          onClick={() => dispatch(toggleSideBar())}
          className="rounded-full text-white text-3xl border-2 p-1 duration-300 ease-in-out"
        >
          <HiBars3 />
        </button>

        <h1 className="hidden md:block text-3xl font-bold">
          Echo
          <span className="inline-block ml-0.5 size-1.5 bg-indigo-400 rounded-full"></span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="outline-none border-2 border-white focus:border-indigo-400 rounded-full text-white placeholder:text-white bg-transparent py-2 px-5 w-60 md:w-80 lg:w-96 duration-300 ease-in-out"
          type="text"
          placeholder="Search User"
        />

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
