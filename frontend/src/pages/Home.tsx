import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Chats from "../layout/Chats";
import SelectChat from "../components/SelectChat";

const Home = () => {
  const loc = useLocation();

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Navbar />
      <Chats />
      {loc.pathname === "/" ? <SelectChat /> : <Outlet />}
    </div>
  );
};

export default Home;
