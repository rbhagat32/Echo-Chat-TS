import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserTypes[] = [];

const SearchSlice = createSlice({
  name: "searchedUsers",
  initialState,
  reducers: {
    setSearches: (_, action: PayloadAction<UserTypes[]>) => {
      return action.payload;
    },
    clearSearches: () => {
      return [];
    },
  },
});

export { SearchSlice };
export const { setSearches, clearSearches } = SearchSlice.actions;
