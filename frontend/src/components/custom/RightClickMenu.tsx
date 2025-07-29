import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2 } from "lucide-react";
import { AlertDialog } from "./AlertDialog";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import { toast } from "sonner";
import { useDeleteMessageMutation } from "@/store/api";
import { getSocket } from "@/Socket";

interface PropTypes {
  children: ReactNode;
  myMessage: boolean;
  message: MessageTypes;
}

const handleCopy = async (messageContent: string) => {
  try {
    await navigator.clipboard.writeText(messageContent);
    toast.success("Copied to clipboard !");
  } catch (err) {
    toast.error("Failed to copy !");
  }
};

export function RightClickMenu({ children, myMessage, message }: PropTypes) {
  const socket = getSocket();
  const [deleteMessage] = useDeleteMessageMutation();

  const handleDeleteMessage = async (message: MessageTypes) => {
    socket?.emit("deleteMessage", message);

    try {
      deleteMessage(message);
      toast.success("Message deleted successfully !");
    } catch (error) {
      toast.error("Failed to delete message !");
    }
  };

  return (
    <AlertDialog
      onConfirm={() => handleDeleteMessage(message)}
      title="Are you sure that you want to delete this message ?"
      description="This action cannot be undone."
    >
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>

        <ContextMenuContent className="w-64">
          {myMessage ? (
            <>
              <ContextMenuItem
                inset
                onClick={() => handleCopy(message.content)}
                className="cursor-pointer"
              >
                Copy
                <ContextMenuShortcut>
                  <Copy size="1rem" />
                </ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuSeparator />

              <AlertDialogTrigger className="w-full" disabled={message._id.startsWith("realtime-")}>
                <ContextMenuItem
                  disabled={message._id.startsWith("realtime-")}
                  variant="destructive"
                  inset
                  className="cursor-pointer"
                >
                  Delete for everyone
                  <ContextMenuShortcut>
                    <Trash2 size="1rem" className="text-rose-400" />
                  </ContextMenuShortcut>
                </ContextMenuItem>
              </AlertDialogTrigger>
            </>
          ) : (
            <>
              <ContextMenuItem
                inset
                onClick={() => handleCopy(message.content)}
                className="cursor-pointer"
              >
                Copy
                <ContextMenuShortcut>
                  <Copy size="1rem" />
                </ContextMenuShortcut>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </AlertDialog>
  );
}
