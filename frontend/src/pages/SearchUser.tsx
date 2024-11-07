import { Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";

const SearchUser = () => {
  return (
    <>
      <div className="w-full px-3 py-3 flex justify-between">
        <Link to={"/"} className="text-3xl font-bold">
          Echo
          <span className="inline-block ml-0.5 size-1.5 bg-indigo-400 rounded-full"></span>
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <SearchBox />
      </div>
    </>
  );
};

export default SearchUser;
