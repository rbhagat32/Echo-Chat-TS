import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Chats from "../layout/Sidebar";
import SelectChat from "../components/SelectChat";
import { useGetUserQuery } from "../store/api";
// import { getSocket } from "../socket";

const Home = () => {
  const loc = useLocation();

  // save user in state
  useGetUserQuery();

  // const socket = getSocket();
  // console.log(socket);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Navbar />
      <Chats />
      {loc.pathname === "/" ? <SelectChat /> : <Outlet />}
    </div>
  );
};

export default Home;
