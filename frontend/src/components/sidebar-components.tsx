import { Search } from "lucide-react";
import { SidebarInput } from "./ui/sidebar";

const SettingsComponent = () => {
  return <div>Settings</div>;
};

const AddPeopleComponent = () => {
  return (
    <div className="relative h-[60vh]">
      <div className="absolute top-5 w-full">
        <SidebarInput
          name="search-users"
          placeholder="Search Users..."
          className="pl-8"
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>

      <div className="mt-20 h-[50vh] overflow-y-scroll flex flex-col gap-2">
        {[...Array(40)].map((_, index) => {
          return (
            <div key={index} className="bg-zinc-800 rounded-sm">
              {index}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RequestsComponent = () => {
  return <div>Requests</div>;
};

export { SettingsComponent, AddPeopleComponent, RequestsComponent };
