import PageLoader from "@/partials/PageLoader";
import {
  api,
  useGetRequestsQuery,
  useRespondRequestMutation,
} from "@/store/api";
import { Tooltip } from "../custom/Tooltip";
import { Check, X as RejectIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const RequestsComponent = () => {
  const dispatch = useDispatch();
  const requestsData = useGetRequestsQuery();
  const [respondRequest] = useRespondRequestMutation();

  // refetch user data on initial render
  useEffect(() => {
    dispatch(api.util.invalidateTags(["User"]));
  }, []);

  return (
    <div className="relative h-[60vh]">
      <div className="absolute top-5 w-full text-center">
        <h1>Pending Requests</h1>
      </div>

      <div className="mt-20 h-[50vh] overflow-y-scroll flex flex-col gap-2">
        {requestsData.isFetching ? (
          <PageLoader />
        ) : requestsData.data?.length == 0 ? (
          <div className="w-full text-center text-zinc-500 text-sm">
            <h1 className="font-semibold">You are all caught up !</h1>
            <p className="text-zinc-600">No pending requests to respond to.</p>
          </div>
        ) : (
          // if users are found, render them
          requestsData.data?.map((user: UserTypes, index) => {
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
                  <div className="flex gap-1">
                    {/* reject request */}
                    <Tooltip text="Reject request">
                      <div
                        onClick={() => {
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
