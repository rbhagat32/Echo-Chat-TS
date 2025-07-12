import { AlertDialog } from "@/components/custom/AlertDialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteChatMutation } from "@/store/api";
import { clearActiveChat } from "@/store/reducers/ActiveChatSlice";
import { clearMessages } from "@/store/reducers/MessageSlice";
import { Tooltip } from "@/components/custom/Tooltip";
import { getSocket } from "@/Socket";
import { Dialog } from "@/components/custom/Dialog";
import ProfilePicture from "@/components/custom/ProfilePicture";

export default function ActiveChatInfo() {
  const socket = getSocket();
  const dispatch = useDispatch();

  // fetch active chat from store
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const onlineUserIds = useSelector((state: StateTypes) => state.onlineUsers);

  // delete chat + clear active chat and messages from store
  const [deleteChat] = useDeleteChatMutation();
  const handleDeleteChat = () => {
    // for real time notification
    socket?.emit("deleteChat", loggedInUser, activeChat);

    try {
      deleteChat(activeChat._id);
      toast.success("Chat deleted successfully !");
      dispatch(clearActiveChat());
      dispatch(clearMessages());
    } catch (error) {
      toast.error("Failed to delete chat !");
    }
  };

  return (
    <div className="h-14 rounded-xl bg-muted/50">
      {activeChat._id === undefined ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500 text-sm">
            Select a chat to view details.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Dialog
              component={
                <ProfilePicture
                  username={activeChat.users[0].username}
                  imageUrl={
                    activeChat.users[0]?.avatar.url || "/placeholder.jpeg"
                  }
                />
              }
            >
              <div className="cursor-pointer shrink-0 size-10 rounded-full overflow-hidden">
                <img
                  src={activeChat.users[0]?.avatar.url || "/placeholder.jpeg"}
                  alt="User Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
            </Dialog>
            <h1 className="text-lg font-semibold">
              {activeChat.users[0].username}
            </h1>
            {onlineUserIds.includes(activeChat.users[0]._id) && (
              <div className="flex items-center gap-1 mt-1 ml-1">
                <div className="size-1.5 rounded-full bg-green-500 mt-0.5" />
                <p className="text-xs text-zinc-600">online</p>
              </div>
            )}
          </div>

          <Tooltip text="Delete chat">
            <AlertDialog
              onConfirm={handleDeleteChat}
              title="Are you sure that you want to delete this chat ?"
              description="This action cannot be undone."
            >
              <div className="hover:bg-zinc-700 rounded-sm p-2 duration-300">
                <Trash2 size="1rem" className="text-rose-400" />
              </div>
            </AlertDialog>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
