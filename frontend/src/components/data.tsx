import { Bell, House, UserRoundPlus } from "lucide-react";

export const SettingsComponent = () => {
  return <div>Settings</div>;
};

const HomeOnCLick = () => {
  alert("Home clicked");
};

const AddPeopleComponent = () => {
  return <div>Add People</div>;
};

const NotificationComponent = () => {
  return <div>Notifications</div>;
};

export const navLinks: {
  name: string;
  icon: React.JSX.Element;
  dialog: boolean;
  onClick?: () => void;
  component?: React.ReactNode;
}[] = [
  {
    name: "Home",
    icon: <House size="1rem" />,
    dialog: false,
    onClick: HomeOnCLick,
  },
  {
    name: "Add people",
    icon: <UserRoundPlus size="1rem" />,
    dialog: true,
    component: <AddPeopleComponent />,
  },
  {
    name: "Notifications",
    icon: <Bell size="1rem" />,
    dialog: true,
    component: <NotificationComponent />,
  },
];
