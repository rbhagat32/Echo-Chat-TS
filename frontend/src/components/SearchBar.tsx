import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import Loader from "../partials/Loader";
import useDebounce from "../hooks/useDebounce";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function SearchBar() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    // don't wait for debounce to set loading to true -> set it immediately when user types the query
    setLoading(true);

    if (query.length === 0) {
      setSearchData([]);
    }
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      setLoading(true);
      axios
        .get(`user/search-user?query=${debouncedQuery}`)
        .then((res) => {
          setSearchData(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [debouncedQuery]);

  const sendRequest = (userId: string) => {
    axios
      .post(`/user/send-request/${userId}`)
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((error) => {
        if (error?.status === 400) {
          toast.error(error?.response?.data?.message);
        }
        console.error(error);
      });
  };

  return (
    <>
      {/* blur div */}
      {query.length > 0 && (
        <div
          onClick={() => setQuery("")}
          className="w-full md:w-[40%] lg:w-[30%] h-screen fixed bg-background pointer-events-auto"
        />
      )}

      <div className="p-5">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search Users :"
            className="w-full p-3 px-5 bg-transparent border-2 border-white rounded-full placeholder:text-white"
          />

          {query.length > 0 ? (
            <IoClose
              className="text-2xl cursor-pointer absolute bottom-[28%] right-[4%]"
              onClick={() => setQuery("")}
            />
          ) : (
            <FaSearch className="absolute bottom-[33%] right-[4%] text-lg" />
          )}
        </div>
      </div>

      {query.length > 0 && (
        <div className="absolute max-h-[50vh] w-full md:w-[40%] lg:w-[30%] overflow-auto bg-background pointer-events-auto">
          {loading ? (
            <Loader height="h-20" />
          ) : (
            <div className="flex flex-col gap-1.5 bg-background px-5">
              {searchData.length === 0 ? (
                <h1 className="mx-auto">No Users found !</h1>
              ) : (
                searchData.map((user: UserTypes, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-backgroundLight hover:bg-indigo-500 px-6 py-3 rounded-lg duration-300 ease-in-out"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="size-14 rounded-full overflow-hidden">
                        <img
                          src={user?.avatar?.url || "/user-placeholder.png"}
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h1 className="text-lg">{user.username}</h1>
                    </div>
                    <button onClick={() => sendRequest(user._id)}>
                      <MdOutlinePersonAddAlt1 className="text-2xl" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
