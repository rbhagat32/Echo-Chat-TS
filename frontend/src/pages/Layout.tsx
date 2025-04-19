import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ActiveChatInfo from "@/layout/ActiveChatInfo";
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
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="size-9 -ml-1 mr-0.5" />
            <Separator orientation="vertical" className="mr-2" />

            <div className="flex items-center gap-2">
              <img src="/logo-light.svg" alt="Logo" className="size-6" />
              <div className="text-2xl font-semibold mb-0.5">
                Echo<span className="text-indigo-500">.</span>
              </div>
            </div>
          </header>

          {/* Chat content -> Chat info + messages */}
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
