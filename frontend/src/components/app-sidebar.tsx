import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { Bell, House, LogOut, Settings, UserRoundPlus } from "lucide-react";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { api, useGetChatsQuery, useGetUserQuery } from "@/store/api";
import { useDispatch } from "react-redux";
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

const navLinks = [
  {
    name: "Home",
    icon: <House size="1rem" />,
  },
  {
    name: "Add people",
    icon: <UserRoundPlus size="1rem" />,
  },
  {
    name: "Notifications",
    icon: <Bell size="1rem" />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Data Fetching
  const userData = useGetUserQuery();
  const chatsData = useGetChatsQuery();

  // Destructure data and loading state
  const user = userData.data;
  const chats = chatsData.data;
  const isLoading = userData.isLoading || chatsData.isLoading;

  // Set active chat into redux store and fetch messages for that chat
  const dispatch = useDispatch();
  const handleClickOnChat = (chat: ChatTypes) => {
    dispatch(setActiveChat(chat));
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
        dispatch(clearMessages());
      })
      .catch(() => {
        toast.error("Failed to logout !");
      });
  };

  return (
    <Sidebar {...props}>
      {/* Sidebar Header -> User info + Search chats */}
      {isLoading ? (
        <div className="px-2 py-3.5 flex flex-col gap-1.5">
          <Skeleton className="h-14" />
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-8" />
          ))}
          <Separator className="mt-2" />
        </div>
      ) : (
        <SidebarHeader>
          <header className="px-2 py-1 flex rounded-lg justify-center items-center gap-2 border bg-muted/50">
            <div className="shrink-0 size-10 rounded-full overflow-hidden">
              <img
                src={user?.avatar.url || "/placeholder.jpeg"}
                alt="User Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="py-2">
                <h1 className="text-base">@{user?.username}</h1>
                <p className="text-xs text-zinc-400">
                  {user?.bio.slice(0, 20)}...
                </p>
              </div>
              <div>
                <button className="hover:bg-muted rounded-sm p-1 duration-300">
                  <Settings size="1rem" />
                </button>
                <AlertDialog
                  onConfirm={logout}
                  title="Are you sure that you want to Logout ?"
                  description="You will be logged out from your account and redirected to login page. To login again, you need to enter your credentials."
                >
                  <button className="hover:bg-muted rounded-sm p-1 duration-300">
                    <LogOut size="1rem" />
                  </button>
                </AlertDialog>
              </div>
            </div>
          </header>

          {/* Search chats field */}
          <SearchForm />

          {/* Navigation Links -> Home, Search, Notification */}
          <div className="flex flex-col gap-1">
            {navLinks.map((item, index) => (
              <button
                key={index}
                className="flex items-center rounded-md px-2 py-1 hover:bg-muted/50 duration-300"
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
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
            {chats?.map((chat, index) => (
              <button
                key={index}
                onClick={() => handleClickOnChat(chat)}
                className="w-full flex items-center rounded-md p-2 hover:bg-muted/50 duration-300"
              >
                <div className="shrink-0 size-8 rounded-full overflow-hidden">
                  <img
                    src={chat.users[0].avatar.url || "/placeholder.jpeg"}
                    alt="Chat Profile Picture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="ml-2">{chat.users[0].username}</span>
              </button>
            ))}
          </div>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
