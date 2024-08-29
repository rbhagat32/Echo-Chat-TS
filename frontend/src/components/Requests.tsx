import { IoClose } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import { useGetRequests } from "../hooks/useGetRequests";
import axios from "../utils/axios";
import { useGetChats } from "../hooks/useGetChats";

interface RequestType {
  _id: string;
  avatar: { url: string };
  username: string;
}

export default function Requests({
  setShowRequests,
}: {
  setShowRequests: (close: boolean) => void;
}) {
  const { loading, requests, fetchRequests } = useGetRequests();
  const { fetchChats } = useGetChats();

  const acceptRequest = (userId: string, index: number) => {
    requests.splice(index, 1);
    axios.post(`/user/respond-request/${userId}?response=accept`).then(() => {
      fetchRequests();
      fetchChats();
    });
  };

  const rejectRequest = (userId: string, index: number) => {
    requests.splice(index, 1);
    axios.post(`/user/respond-request/${userId}?response=reject`).then(() => {
      fetchRequests();
    });
  };

  return (
    !loading && (
      <div className="min-w-96 max-h-[500px] overflow-auto fixed z-[1000] top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] p-10 border-2 border-neutral-700 bg-backgroundLight rounded-lg">
        <button
          onClick={() => setShowRequests(false)}
          className="absolute top-3 right-3"
        >
          <IoClose className="text-2xl" />
        </button>
        <h1 className="text-center mb-8 text-3xl font-semibold">Requests</h1>
        {requests.length > 0 ? (
          requests.reverse().map((req: RequestType, index: number) => {
            return (
              <div
                key={index}
                className="mb-4 flex items-center justify-between px-4 py-2 border rounded-lg border-neutral-700"
              >
                <div className="flex gap-4 items-center">
                  <div className="size-14 rounded-full overflow-hidden">
                    <img
                      src={req.avatar.url || "/user-placeholder.png"}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h1 className="text-xl">{req.username}</h1>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => acceptRequest(req._id, index)}>
                    <MdDone className="size-7 text-green-500" />
                  </button>
                  <button onClick={() => rejectRequest(req._id, index)}>
                    <IoClose className="size-7 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="text-center">No Pending Requests!</h1>
        )}
      </div>
    )
  );
}
