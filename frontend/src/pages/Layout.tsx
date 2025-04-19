import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ActiveChatInfo from "@/layout/ActiveChatInfo";
import Header from "@/layout/Header";
import MessageContainer from "@/layout/MessageContainer";

export default function Layout() {
  return (
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
  );
}
