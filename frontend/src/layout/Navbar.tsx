import { HiBars3 } from "react-icons/hi2";
import { toggleSideBar } from "../store/reducers/MiscSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoMdNotifications } from "react-icons/io";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isSideBarOpen } = useSelector((state: StateTypes) => state.misc);

  return (
    <div className="w-full fixed p-4 lg:px-8 z-[100] flex justify-between">
      <button
        onClick={() => dispatch(toggleSideBar())}
        className={`${
          isSideBarOpen ? "border-white" : "border-indigo-400"
        } rounded-full text-white text-3xl border-2 p-1 duration-300 ease-in-out`}
      >
        <HiBars3 />
      </button>

      <div className="flex items-center gap-2">
        <input
          className="outline-none border-2 border-white focus:border-indigo-400 rounded-full text-white placeholder:text-white bg-transparent py-2 px-6 w-60 md:w-80 lg:w-96 duration-300 ease-in-out"
          type="text"
          placeholder="Search"
        />
        <button className="relative text-3xl">
          <span className="absolute top-0 right-0 block size-1.5 bg-green-500 rounded-full"></span>
          <IoMdNotifications />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
