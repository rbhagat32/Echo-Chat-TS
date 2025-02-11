import { IoPersonAddSharp } from "react-icons/io5";
import { MdAddTask } from "react-icons/md";
import { useSelector } from "react-redux";
import SearchBox from "../components/SearchBox";

const SearchUser = () => {
  const searchedUsers = useSelector((state: StateTypes) => state.searchedUsers);

  return (
    <>
      <div className="relative top-20 flex flex-col items-center">
        <SearchBox />

        <div className="w-[80%] max-w-[500px] mt-5">
          {searchedUsers.length > 0 ? (
            searchedUsers.map((user: UserTypes, index: number) => (
              <div
                key={index}
                className="w-full flex gap-2 items-center justify-between bg-zinc-700 hover:bg-indigo-500 mb-2 p-3 rounded-lg"
              >
                <div className="flex gap-3 items-center">
                  <div className="size-12 overflow-hidden rounded-full">
                    <img
                      src={user.avatar.url || "/placeholder.jpeg"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xl">{user.username}</p>
                </div>
                <button className="text-xl mr-2">
                  <MdAddTask />
                  <IoPersonAddSharp />
                </button>
              </div>
            ))
          ) : (
            <div>
              <p className="mx-auto w-fit text-lg">No Users Found !</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchUser;
