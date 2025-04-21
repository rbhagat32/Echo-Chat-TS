import {
  Search,
  UserRoundPlus,
  X as RejectIcon,
  Check,
  Loader,
  CheckCheck,
} from "lucide-react";
import { SidebarInput } from "./ui/sidebar";
import { useLazySearchUserQuery } from "@/store/api";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import PageLoader from "@/partials/PageLoader";
import { Tooltip } from "./custom/Tooltip";
import { useSelector } from "react-redux";

const SettingsComponent = () => {
  return <div>Settings</div>;
};

const AddPeopleComponent = () => {
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const [trigger, remainingData] = useLazySearchUserQuery();

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 250);

  const [searchData, setSearchData] = useState<UserTypes[]>([]);

  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.length > 0) {
        const result = await trigger(debouncedQuery);
        setSearchData(result.data as UserTypes[]);
      } else {
        setSearchData([]);
      }
    };

    handleSearch();
  }, [debouncedQuery]);

  return (
    <div className="relative h-[60vh]">
      <div className="absolute top-5 w-full">
        <SidebarInput
          id="search-users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Users..."
          className="pl-8"
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>

      <div className="mt-20 h-[50vh] overflow-y-scroll flex flex-col gap-2">
        {remainingData.isFetching ? (
          // loading state
          <PageLoader />
        ) : // if nothing is typed in search bar
        debouncedQuery.length == 0 ? (
          <div className="w-full text-center text-zinc-500 text-sm">
            <h1 className="font-semibold">Search for users to send request.</h1>
            <p className="text-zinc-600">
              Type a username in the search bar above.
            </p>
          </div>
        ) : // if no users are found
        searchData.length == 0 ? (
          <div className="w-full text-center text-zinc-500 text-sm">
            <h1 className="font-semibold">No users found.</h1>
            <p className="text-zinc-600">
              Try searching for a different username.
            </p>
          </div>
        ) : (
          // if users are found, render them
          searchData?.map((user: UserTypes, index) => {
            return (
              <div
                key={index}
                className="w-full flex justify-between items-center rounded-md p-2 hover:bg-muted/50 duration-300"
              >
                <div className="flex items-center">
                  <div className="relative shrink-0 size-8 rounded-full overflow-hidden">
                    <img
                      src={user.avatar?.url || "/placeholder.jpeg"}
                      alt="Chat Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="ml-2 text-sm">{user.username}</p>
                </div>

                {/* rendering buttons */}
                {
                  // if user is already added to chats
                  loggedInUser.chats.includes(user.chats[0]) ? (
                    <Tooltip text="Already added">
                      <div className="cursor-not-allowed hover:bg-zinc-700 rounded-sm p-2 duration-300">
                        <CheckCheck size="1rem" />
                      </div>
                    </Tooltip>
                  ) : // if loggedin user has pending request from this user
                  loggedInUser.requests.includes(user._id) ? (
                    <div className="flex gap-1">
                      {/* reject request */}
                      <Tooltip text="Reject request">
                        <div className="hover:bg-zinc-700 rounded-sm p-2 duration-300">
                          <RejectIcon size="1rem" className="text-rose-400" />
                        </div>
                      </Tooltip>
                      {/* accept request */}
                      <Tooltip text="Accept request">
                        <div className="hover:bg-zinc-700 rounded-sm p-2 duration-300">
                          <Check size="1rem" />
                        </div>
                      </Tooltip>
                    </div>
                  ) : // if loggedin user has already sent request to this user
                  user.requests.includes(loggedInUser._id) ? (
                    <Tooltip text="Request Sent">
                      <div className="cursor-not-allowed hover:bg-zinc-700 rounded-sm p-2 duration-300">
                        <Loader size="1rem" />
                      </div>
                    </Tooltip>
                  ) : (
                    // else you can send request
                    <Tooltip text="Send Request">
                      <div className="hover:bg-zinc-700 rounded-sm p-2 duration-300">
                        <UserRoundPlus size="1rem" />
                      </div>
                    </Tooltip>
                  )
                }
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const RequestsComponent = () => {
  return <div>Requests</div>;
};

export { SettingsComponent, AddPeopleComponent, RequestsComponent };
