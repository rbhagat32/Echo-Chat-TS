import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import { useDispatch } from "react-redux";
import { setActiveChat } from "../store/reducers/MiscSlice";

const SearchUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToHome = () => {
    dispatch(
      setActiveChat({
        chatId: "",
        userId: "",
        username: "",
        avatar: "",
        bio: "",
      })
    );
    navigate("/");
  };

  return (
    <>
      <div className="w-full px-3 py-3 flex justify-between">
        <button onClick={goToHome} className="text-3xl font-bold">
          Echo
          <span className="inline-block ml-0.5 size-1.5 bg-indigo-400 rounded-full"></span>
        </button>
      </div>

      <div className="flex flex-col items-center">
        <SearchBox />
      </div>
    </>
  );
};

export default SearchUser;
