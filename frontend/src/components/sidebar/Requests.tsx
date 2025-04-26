import PageLoader from "@/partials/PageLoader";
import {
  api,
  useGetRequestsQuery,
  useRespondRequestMutation,
} from "@/store/api";
import { Tooltip } from "../custom/Tooltip";
import { Check, X as RejectIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/Socket";

export const RequestsComponent = () => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { isFetching } = useGetRequestsQuery();
  const [respondRequest] = useRespondRequestMutation();
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const requests = useSelector((state: StateTypes) => state.requests);
  const onlineUserIds = useSelector((state: StateTypes) => state.onlineUsers);

  // refetch user data on initial render
  useEffect(() => {
    dispatch(api.util.invalidateTags(["User", "Chats"]));
  }, []);

  return (
    <div className="relative h-[60vh]">
      <div className="absolute top-5 w-full text-center">
        <h1>Pending Requests</h1>
      </div>

      <div className="mt-20 h-[50vh] overflow-y-scroll flex flex-col gap-2">
        {isFetching ? (
          <PageLoader />
        ) : requests?.length == 0 ? (
          <div className="w-full text-center text-zinc-500 text-sm">
            <h1 className="font-semibold">You are all caught up !</h1>
            <p className="text-zinc-600">No pending requests to respond to.</p>
          </div>
        ) : (
          // if users are found, render them
          requests?.map((user: UserTypes, index) => {
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
                  {onlineUserIds.includes(user._id) && (
                    <div className="flex items-center gap-1 mt-1.5 ml-2">
                      <div className="size-1.5 rounded-full bg-green-500 mt-0.5" />
                      <p className="text-[10px] text-zinc-600">online</p>
                    </div>
                  )}
                </div>

                {/* rendering buttons */}
                {
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
                        }}
                        className="hover:bg-zinc-700 rounded-sm p-2 duration-300"
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
                        }}
                        className="hover:bg-zinc-700 rounded-sm p-2 duration-300"
                      >
                        <Check size="1rem" />
                      </div>
                    </Tooltip>
                  </div>
                }
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
