import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="size-9 -ml-1 mr-0.5" />

      <Separator orientation="vertical" className="mr-2" />

      <div className="flex items-center gap-2">
        <img src="/logo-light.svg" alt="Logo" className="size-6" />
        <div className="text-2xl font-semibold mb-0.5">Echo.</div>
      </div>
    </header>
  );
}
