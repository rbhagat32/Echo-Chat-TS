import Button from "./Button";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import Requests from "./Requests";
import { useState } from "react";

export default function TopBar({ user }: { user: UserTypes }) {
  const navigate = useNavigate();
  const [showRequests, setShowRequests] = useState(false);

  const logout = () => {
    axios.get("/auth/logout").then(() => {
      navigate("/login");
    });
  };

  return (
    <>
      <div className="h-[10vh] px-5 py-3 flex justify-between items-center border-b border-neutral-700">
        <Link to={""} className="flex gap-4 items-center">
          <div className="size-14 rounded-full overflow-hidden">
            <img
              src={user.avatar.url || "/user-placeholder.png"}
              alt="LoggedIn User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold">
            {user.username}
            <span className="text-neutral-700 inline-block ml-2 text-lg">
              --me
            </span>
          </h1>
        </Link>

        <div className="flex gap-6 items-center">
          <button onClick={() => setShowRequests(!showRequests)}>
            <IoNotifications className="size-7" />
          </button>
          <Button text="Logout" onClick={logout} />
        </div>
      </div>

      {showRequests && <Requests setShowRequests={setShowRequests} />}
    </>
  );
}
