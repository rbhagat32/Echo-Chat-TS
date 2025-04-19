import { AlertDialog } from "@/components/custom/AlertDialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteChatMutation } from "@/store/api";
import { clearActiveChat } from "@/store/reducers/ActiveChatSlice";
import { clearMessages } from "@/store/reducers/MessageSlice";
import { Tooltip } from "@/components/custom/Tooltip";

export default function ActiveChatInfo() {
  // fetch active chat from store
  const activeChat = useSelector((state: StateTypes) => state.activeChat);

  // delete chat + clear active chat and messages from store
  const dispatch = useDispatch();
  const [deleteChat] = useDeleteChatMutation();
  const handleDeleteChat = () => {
    try {
      deleteChat(activeChat._id);
      toast.success("Chat deleted successfully.");
      dispatch(clearActiveChat());
      dispatch(clearMessages());
    } catch (error) {
      toast.error("Failed to delete chat.");
      console.error("Failed to delete chat:", error);
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
            <div className="shrink-0 size-10 rounded-full overflow-hidden">
              <img
                src={activeChat.users[0]?.avatar.url || "/placeholder.jpeg"}
                alt="User Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-lg font-semibold">
              {activeChat.users[0].username}
            </h1>
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
