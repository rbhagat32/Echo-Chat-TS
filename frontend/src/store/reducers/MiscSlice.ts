import { createSlice } from "@reduxjs/toolkit";

const initialState: MiscTypes = {
  // isSideBarOpen: window.innerWidth > 768 ? true : false,
  isSideBarOpen: false,
  activeChat: {
    chatId: "",
    userId: "",
    username: "",
    avatar: "",
    bio: "",
  },
};

const MiscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
});

export { MiscSlice };
export const { toggleSideBar, setActiveChat } = MiscSlice.actions;
