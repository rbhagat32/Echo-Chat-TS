import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { LogOut, Settings } from "lucide-react";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import {
  api,
  useGetChatsQuery,
  useGetRequestsQuery,
  useGetUserQuery,
} from "@/store/api";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActiveChat,
  setActiveChat,
} from "../store/reducers/ActiveChatSlice";
import { AlertDialog } from "./custom/AlertDialog";
import { axios } from "@/utils/axios";
import { toast } from "sonner";
import { setAuth } from "@/store/reducers/AuthSlice";
import { clearChats } from "@/store/reducers/ChatSlice";
import { clearUser } from "@/store/reducers/UserSlice";
import { clearMessages } from "@/store/reducers/MessageSlice";
import { Tooltip } from "./custom/Tooltip";
import { getSocket } from "@/Socket";
import {
  clearLatestChats,
  removeLatestChat,
} from "@/store/reducers/LatestChatSlice";
import { Dialog } from "./custom/Dialog";
import { SettingsComponent } from "./sidebar/Settings";
import { useNavLinks } from "@/hooks/useNavLinks";
import { appendRequest, clearRequests } from "@/store/reducers/RequestsSlice";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navLinksData = useNavLinks();

  // Data Fetching hooks
  const userData = useGetUserQuery();
  const chatsData = useGetChatsQuery();
  useGetRequestsQuery();

  // data from redux store
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const latestChats = useSelector((state: StateTypes) => state.latestChats);
  const requests = useSelector((state: StateTypes) => state.requests);

  // Destructure data and loading state
  const user = userData.data;
  const chats = chatsData.data;
  const isLoading = userData.isLoading || chatsData.isLoading;

  const handleOpenChat = async (chat: ChatTypes) => {
    // refetch chats to order by latest message
    dispatch(api.util.invalidateTags(["Chats"]));

    // set active chat if that chat is not already active
    if (chat._id !== activeChat._id) dispatch(setActiveChat(chat));

    // remove all instances of the clicked chat from latest chats
    dispatch(removeLatestChat(chat));
  };

  // Logout function
  const logout = () => {
    axios
      .get("/auth/logout")
      .then(() => {
        toast.success("Logged out successfully !");
        dispatch(setAuth(false));
        dispatch(api.util.invalidateTags(["Auth"]));
        dispatch(clearUser());
        dispatch(clearChats());
        dispatch(clearActiveChat());
        dispatch(clearLatestChats());
        dispatch(clearMessages());
        dispatch(clearRequests());

        socket!.disconnect();
      })
      .catch((error) => {
        toast.error(error.response.data.message || "Failed to logout !");
      });
  };

  // search chat functionality
  const [filteredChats, setFilteredChats] = React.useState<ChatTypes[]>([]);
  // Set filtered chats when chats data is fetched
  React.useEffect(() => {
    if (chats) {
      setFilteredChats(chats);
    }
  }, [chats]);

  // Search chats by username
  const searchChats = (query: string) => {
    // if query is empty, set filtered chats to all chats
    if (!query) {
      setFilteredChats(chats!);
      return;
    }

    // if query is not empty, filter chats by what is typed in query
    if (chats) {
      setFilteredChats(
        chats.filter((chat) => chat.users[0].username.includes(query))
      );
    }
  };

  // socket listener for realtime request
  React.useEffect(() => {
    socket?.on("realtimeRequest", (user: UserTypes) => {
      // append this user to requests in redux store
      dispatch(appendRequest(user));
    });

    socket?.on(
      "realtimeDeleteChat",
      (user: UserTypes, deletedChat: ChatTypes) => {
        toast.warning(`${user.username} deleted the chat !`, {
          description: "Refreshing in 3..2..1..",
        });

        if (activeChat._id === deletedChat._id) {
          // if active chat is deleted by other user, clear active chat and messages
          dispatch(clearActiveChat());
          dispatch(clearMessages());
        } else {
          // if non active chat is deleted, remove it from latest chats and clear messages
          dispatch(removeLatestChat(deletedChat));
          dispatch(clearMessages());
        }

        setTimeout(() => {
          dispatch(api.util.invalidateTags(["User", "Chats"]));
        }, 3000);
      }
    );

    socket?.on("realtimeAccept", (user: UserTypes) => {
      toast.success(`${user.username} accepted your request !`, {
        description: "Refreshing in 3..2..1..",
      });

      setTimeout(() => {
        dispatch(
          api.util.invalidateTags(["User", "Chats", "Searches", "Requests"])
        );
      }, 3000);
    });

    socket?.on("realtimeReject", (user: UserTypes) => {
      toast.warning(`${user.username} rejected your request !`);

      setTimeout(() => {
        dispatch(api.util.invalidateTags(["User", "Searches", "Requests"]));
      }, 3000);
    });

    return () => {
      socket?.off("realtimeRequest");
      socket?.off("realtimeDeleteChat");
      socket?.off("realtimeAccept");
      socket?.off("realtimeReject");
    };
  }, [socket, user, activeChat]);

  return (
    <Sidebar {...props}>
      {/* Sidebar Header -> User info + Search chats + Navigation links */}
      {isLoading ? (
        <div className="px-2 py-3.5 flex flex-col gap-1.5">
          <Skeleton className="h-14" />
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-10" />
          ))}
          <Separator className="mt-2" />
        </div>
      ) : (
        <SidebarHeader>
          {/* Logged in user info */}
          <header className="px-2 py-1 flex rounded-lg justify-center items-center gap-2 border bg-muted/50">
            <div className="shrink-0 size-10 rounded-full overflow-hidden">
              <img
                src={user?.avatar!.url || "/placeholder.jpeg"}
                alt="User Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="py-2">
                <h1 className="text-base">@{user?.username}</h1>
                <p className="text-xs text-zinc-400">
                  {user?.bio?.length! > 20
                    ? user?.bio!.slice(0, 20) + "..."
                    : user?.bio}
                </p>
              </div>
              <div>
                <Tooltip text="Settings">
                  <Dialog component={<SettingsComponent />}>
                    <div className="hover:bg-zinc-700 rounded-sm p-1.5 duration-300">
                      <Settings size="1rem" />
                    </div>
                  </Dialog>
                </Tooltip>

                <Tooltip text="Logout">
                  <AlertDialog
                    onConfirm={logout}
                    title="Are you sure that you want to Logout ?"
                    description="You will be logged out from your account and redirected to login page. To login again, you need to enter your credentials."
                  >
                    <div className="hover:bg-zinc-700 rounded-sm p-1.5 duration-300">
                      <LogOut size="1rem" />
                    </div>
                  </AlertDialog>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* Search chats field */}
          <SearchForm
            onChange={(e) => searchChats((e.target as HTMLInputElement).value)}
          />

          {/* Navigation Links -> Home, Search, Requests */}
          <div className="flex flex-col gap-1">
            {navLinksData.map((item, index) =>
              !item.dialog ? (
                <div
                  key={index}
                  onClick={item.onClick}
                  className="cursor-pointer flex items-center rounded-md p-3 hover:bg-muted/50 duration-300"
                >
                  <p className="mr-2">{item.icon}</p>
                  <p className="text-sm">{item.name}</p>
                </div>
              ) : (
                <Dialog key={index} component={item.component}>
                  <div className="cursor-pointer flex justify-between items-center rounded-md p-3 hover:bg-muted/50 duration-300">
                    <div className="flex items-center">
                      <p className="mr-2">{item.icon}</p>
                      <p className="text-sm">{item.name}</p>
                    </div>
                    {requests.length > 0 && item.name === "Requests" && (
                      <div className="flex items-center gap-1">
                        <div className="size-1.5 rounded-full bg-green-500 mt-0.5" />
                        <p className="text-xs text-zinc-600">new</p>
                      </div>
                    )}
                  </div>
                </Dialog>
              )
            )}
          </div>
          <Separator className="mt-2" />
        </SidebarHeader>
      )}

      <SidebarContent className="px-2">
        <SidebarGroupLabel>Chats</SidebarGroupLabel>

        {/* Render Chats */}
        {isLoading ? (
          <div className="px-2 py-3.5 flex flex-col gap-1.5">
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} className="h-9" />
            ))}
          </div>
        ) : (
          <div className="pb-2">
            {filteredChats?.length == 0 ? (
              <div className="w-full text-center text-zinc-500 text-sm">
                <h1 className="font-semibold">No chats found !</h1>
                <p className="text-zinc-600">
                  Connect with friends to start chatting.
                </p>
              </div>
            ) : (
              filteredChats?.map((chat: ChatTypes, index: number) => {
                // check if chat is present in latest chats array and it is not active currently
                // if yes, then show (. new) notification
                const isLatest =
                  latestChats?.some(
                    (latestChat) =>
                      latestChat._id === chat._id &&
                      latestChat._id !== activeChat._id
                  ) || false;

                return (
                  <button
                    key={index}
                    onClick={() => handleOpenChat(chat)}
                    className={`w-full flex justify-between items-center ${
                      activeChat._id === chat._id && "bg-zinc-800"
                    } rounded-md p-2 hover:bg-muted/50 duration-300`}
                  >
                    <div className="flex items-center">
                      <div className="relative shrink-0 size-8 rounded-full overflow-hidden">
                        <img
                          src={chat.users[0].avatar.url || "/placeholder.jpeg"}
                          alt="Chat Profile Picture"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="ml-2 text-sm">{chat.users[0].username}</p>
                    </div>

                    {isLatest && (
                      <div className="flex items-center gap-1">
                        <div className="size-1.5 rounded-full bg-green-500 mt-0.5" />
                        <p className="text-xs text-zinc-600">new</p>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
