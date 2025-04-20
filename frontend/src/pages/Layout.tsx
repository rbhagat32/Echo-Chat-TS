import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ActiveChatInfo from "@/layout/ActiveChatInfo";
import Header from "@/layout/Header";
import MessageContainer from "@/layout/MessageContainer";
import { getSocket } from "@/Socket";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Layout() {
  const socket = getSocket();
  const offlineToastId = useRef<string | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      const id = toast.error("You are offline!", {
        description: "Please check your internet connection.",
        duration: Infinity,
      });

      // Store the toast ID to dismiss it when back online
      offlineToastId.current = id as string;

      socket?.disconnect();
    };

    const handleBackOnline = () => {
      toast.success("You are back online!");

      // Dismiss the offline toast if it exists and set the ID to null
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }

      socket?.connect();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleBackOnline);

    return () => {
      // Cleanup event listeners on unmount
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleBackOnline);

      // Cleanup toast on unmount
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
      }

      // Cleanup ref on unmount
      offlineToastId.current = null;

      // Cleanup socket listeners on unmount
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, [socket]);

  return (
    <>
      <main>
        <SidebarProvider>
          {/* Sidebar */}
          <AppSidebar variant="floating" />

          {/* Main Content -> right side of sidebar */}
          <SidebarInset>
            {/* Header -> sidebar open/close button + Echo logo */}
            <Header />

            {/* Chat content -> Active Chat info + messages */}
            <div className="flex flex-col gap-4 p-4">
              {/* Active Chat Info */}
              <ActiveChatInfo />

              {/* Message Container + Message Input */}
              <MessageContainer />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </main>
    </>
  );
}
