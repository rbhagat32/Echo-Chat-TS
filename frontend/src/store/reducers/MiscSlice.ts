import { createSlice } from "@reduxjs/toolkit";

const initialState: MiscTypes = {
  // isSideBarOpen: window.innerWidth > 768 ? true : false,
  isSideBarOpen: false,
};

const MiscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
  },
});

export { MiscSlice };
export const { toggleSideBar } = MiscSlice.actions;
