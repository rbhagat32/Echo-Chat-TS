import { Dispatch } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { getUser } from "../reducers/UserReducer";
import { AxiosError } from "axios";
export { removeUser } from "../reducers/UserReducer";

const asyncGetUser = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await axios.get("/user/get-user");
    dispatch(getUser(data));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export { asyncGetUser };
