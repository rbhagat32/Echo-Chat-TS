import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useDebounce from "../hooks/useDebounce";
import { clearSearches, setSearches } from "../store/reducers/SearchSlice";
import axios from "../utils/axios";

const SearchBox = () => {
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      axios
        .get(`/user/search-user?query=${debouncedQuery}`)
        .then((res) => {
          dispatch(setSearches(res.data));
        })
        .catch((err) => console.error(err));
    } else {
      dispatch(clearSearches());
    }
  }, [debouncedQuery]);

  return (
    <input
      ref={inputRef}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-[80%] max-w-[500px] px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none focus:ring focus:border-indigo-500 placeholder:text-white placeholder:font-semibold"
      type="text"
      placeholder="Search User"
    />
  );
};

export default SearchBox;
