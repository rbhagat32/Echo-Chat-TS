import { getSocket } from "@/Socket";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { isImageUrl } from "@/helpers/CheckImageUrl";
import { useDeleteMessageMutation } from "@/store/api";
import { Copy, Download, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import { AlertDialog } from "./AlertDialog";

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
                {isImageUrl(message.content) ? "Copy Image URL" : "Copy Text"}
                <ContextMenuShortcut>
                  <Copy size="1rem" />
                </ContextMenuShortcut>
              </ContextMenuItem>

              {isImageUrl(message.content) && (
                <>
                  <ContextMenuSeparator />

                  <ContextMenuItem
                    inset
                    onClick={async () => {
                      try {
                        const response = await fetch(message.content);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = message.content.split("/").pop() || "download";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed:", error);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    Download
                    <ContextMenuShortcut>
                      <Download size="1rem" />
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </>
              )}

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
                {isImageUrl(message.content) ? "Copy Image URL" : "Copy Text"}
                <ContextMenuShortcut>
                  <Copy size="1rem" />
                </ContextMenuShortcut>
              </ContextMenuItem>

              {isImageUrl(message.content) && (
                <>
                  <ContextMenuSeparator />

                  <ContextMenuItem
                    inset
                    onClick={async () => {
                      try {
                        const response = await fetch(message.content);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = message.content.split("/").pop() || "download";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error("Download failed:", error);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    Download
                    <ContextMenuShortcut>
                      <Download size="1rem" />
                    </ContextMenuShortcut>
                  </ContextMenuItem>
                </>
              )}
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </AlertDialog>
  );
}
