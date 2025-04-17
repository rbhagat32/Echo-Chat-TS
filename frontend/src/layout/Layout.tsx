import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>Echo.</div>
          </header>

          <div className="flex flex-col gap-4 p-4">
            <div className="h-14 rounded-xl bg-muted/50">Active Chat Info</div>
            <div className="rounded-xl bg-muted/50">
              <div
                style={{ height: "calc(100vh - 13.5rem - 1px)" }}
                className="overflow-y-auto"
              >
                {[...Array(80)].map(() => (
                  <p>Message Container</p>
                ))}
              </div>

              <Separator orientation="horizontal" />

              <div className="h-14">Message Input</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
