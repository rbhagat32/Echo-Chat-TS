import * as React from "react";
import { Bell, House, UserRoundPlus } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearActiveChat } from "@/store/reducers/ActiveChatSlice";
import { clearMessages } from "@/store/reducers/MessageSlice";
import { AddPeopleComponent } from "../components/sidebar/AddPeople";
import { RequestsComponent } from "../components/sidebar/Requests";

interface NavLink {
  name: string;
  icon: React.JSX.Element;
  dialog: boolean;
  onClick?: () => void;
  component?: React.ReactNode;
}

export const useNavLinks = (): NavLink[] => {
  const dispatch = useDispatch();

  return [
    {
      name: "Home",
      icon: <House size="1rem" />,
      dialog: false,
      onClick: () => {
        dispatch(clearActiveChat());
        dispatch(clearMessages());
      },
    },
    {
      name: "Add people",
      icon: <UserRoundPlus size="1rem" />,
      dialog: true,
      component: <AddPeopleComponent />,
    },
    {
      name: "Requests",
      icon: <Bell size="1rem" />,
      dialog: true,
      component: <RequestsComponent />,
    },
  ];
};
