import { AlertDialog } from "@/components/custom/AlertDialog";
import { Dialog } from "@/components/custom/Dialog";
import ProfilePicture from "@/components/custom/ProfilePicture";
import { Tooltip } from "@/components/custom/Tooltip";
import { getSocket } from "@/Socket";
import { useDeleteChatMutation } from "@/store/api";
import { clearActiveChat } from "@/store/reducers/ActiveChatSlice";
import { clearMessages } from "@/store/reducers/MessageSlice";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

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
    <div className="bg-muted/50 h-14 rounded-xl">
      {activeChat._id === undefined ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-zinc-500">Select a chat to view details.</p>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <Dialog
              component={
                <ProfilePicture
                  username={activeChat.users[0].username}
                  imageUrl={activeChat.users[0]?.avatar.url || "/placeholder.jpeg"}
                />
              }
            >
              <div className="size-10 shrink-0 cursor-pointer overflow-hidden rounded-full">
                <img
                  src={activeChat.users[0]?.avatar.url || "/placeholder.jpeg"}
                  alt="User Profile Picture"
                  className="h-full w-full object-cover"
                />
              </div>
            </Dialog>
            <h1 className="text-lg font-semibold">{activeChat.users[0].username}</h1>
            {onlineUserIds.includes(activeChat.users[0]._id) && (
              <div className="mt-1 ml-1 flex items-center gap-1">
                <div className="mt-0.5 size-1.5 rounded-full bg-green-500" />
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
              <div className="rounded-sm p-2 duration-300 hover:bg-zinc-700">
                <Trash2 size="1rem" className="text-rose-400" />
              </div>
            </AlertDialog>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
