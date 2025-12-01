import useDebounce from "@/hooks/useDebounce";
import PageLoader from "@/partials/PageLoader";
import { getSocket } from "@/Socket";
import {
  api,
  useLazySearchUserQuery,
  useRespondRequestMutation,
  useSendRequestMutation,
} from "@/store/api";
import { Check, CheckCheck, Loader, X as RejectIcon, Search, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from ".././custom/Tooltip";
import { SidebarInput } from ".././ui/sidebar";
import { Dialog } from "../custom/Dialog";
import ProfilePicture from "../custom/ProfilePicture";

export const AddPeopleComponent = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const onlineUserIds = useSelector((state: StateTypes) => state.onlineUsers);

  // search functionality
  const [trigger, remainingData] = useLazySearchUserQuery();
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 250);

  // trigger search when debouncedQuery changes
  useEffect(() => {
    // refetch user data on initial render and when search query changes so that the latest requests data is available
    dispatch(api.util.invalidateTags(["User", "Chats"]));

    const handleSearch = () => {
      if (debouncedQuery.length > 0) {
        trigger(debouncedQuery);
      }
    };
    handleSearch();
  }, [debouncedQuery]);

  // send request functionality
  const [sendRequest] = useSendRequestMutation();

  // respond to request functionality
  const [respondRequest] = useRespondRequestMutation();

  return (
    <div className="relative h-[60vh]">
      <div className="absolute top-6 w-full">
        <SidebarInput
          id="search-users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Users..."
          className="pl-8"
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>

      <div className="mt-20 flex h-[50vh] flex-col gap-2 overflow-y-scroll">
        {remainingData.isFetching ? (
          // loading state
          <PageLoader />
        ) : // if nothing is typed in search bar
        debouncedQuery.length == 0 ? (
          <div className="w-full text-center text-sm text-zinc-500">
            <h1 className="font-semibold">Search for users to send request !</h1>
            <p className="text-zinc-600">Type a username in the search bar above.</p>
          </div>
        ) : // if no users are found
        remainingData?.data?.length == 0 ? (
          <div className="w-full text-center text-sm text-zinc-500">
            <h1 className="font-semibold">No users found !</h1>
            <p className="text-zinc-600">Try searching for a different username.</p>
          </div>
        ) : (
          // if users are found, render them
          remainingData.data?.map((user: UserTypes, index) => {
            return (
              <div
                key={index}
                className="hover:bg-muted/50 flex w-full items-center justify-between rounded-md p-2 duration-300"
              >
                <div className="flex items-center">
                  <Dialog
                    component={
                      <ProfilePicture
                        username={user.username}
                        imageUrl={user.avatar?.url || "/placeholder.jpeg"}
                      />
                    }
                  >
                    <div className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-full">
                      <img
                        src={user.avatar?.url || "/placeholder.jpeg"}
                        alt="Chat Profile Picture"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Dialog>
                  <p className="ml-2 text-sm">{user.username}</p>
                  {onlineUserIds.includes(user._id) && (
                    <div className="mt-1.5 ml-2 flex items-center gap-1">
                      <div className="mt-0.5 size-1.5 rounded-full bg-green-500" />
                      <p className="text-[10px] text-zinc-600">online</p>
                    </div>
                  )}
                </div>

                {/* rendering buttons */}
                {
                  // if loggedin user and this user are already in same chat
                  user.chats.some((chatId) => loggedInUser?.chats?.includes(chatId)) ? (
                    <Tooltip text="Already added">
                      <div className="cursor-not-allowed rounded-sm p-2 duration-300 hover:bg-zinc-700">
                        <CheckCheck size="1rem" />
                      </div>
                    </Tooltip>
                  ) : // if loggedin user has pending request from this user
                  loggedInUser?.requests?.includes(user._id) ? (
                    <div className="flex gap-1">
                      {/* reject request */}
                      <Tooltip text="Reject request">
                        <div
                          onClick={() => {
                            socket?.emit("reject", loggedInUser, user);
                            respondRequest({
                              userId: user._id,
                              response: "reject",
                            });
                            setQuery("");
                          }}
                          className="rounded-sm p-2 duration-300 hover:bg-zinc-700"
                        >
                          <RejectIcon size="1rem" className="text-rose-400" />
                        </div>
                      </Tooltip>
                      {/* accept request */}
                      <Tooltip text="Accept request">
                        <div
                          onClick={() => {
                            socket?.emit("accept", loggedInUser, user);
                            respondRequest({
                              userId: user._id,
                              response: "accept",
                            });
                            setQuery("");
                          }}
                          className="rounded-sm p-2 duration-300 hover:bg-zinc-700"
                        >
                          <Check size="1rem" />
                        </div>
                      </Tooltip>
                    </div>
                  ) : // if loggedin user has already sent request to this user
                  user?.requests?.includes(loggedInUser._id) ? (
                    <Tooltip text="Request pending">
                      <div className="cursor-not-allowed rounded-sm p-2 duration-300 hover:bg-zinc-700">
                        <Loader size="1rem" />
                      </div>
                    </Tooltip>
                  ) : (
                    // else you can send request
                    <Tooltip text="Send request">
                      <div
                        onClick={() => {
                          // for realtime notification
                          socket?.emit("request", loggedInUser, user);

                          // for api request
                          sendRequest({
                            userId: user._id,
                            loggedInUserId: loggedInUser._id,
                            // original debouncedQuery is reqd as argument for "searchUser" query
                            debouncedQuery: debouncedQuery,
                          });
                        }}
                        className="rounded-sm p-2 duration-300 hover:bg-zinc-700"
                      >
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
