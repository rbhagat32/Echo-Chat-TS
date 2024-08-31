import axios from "../../utils/axios";
import { getChats } from "../reducers/ChatReducer";
import { AxiosError } from "axios";
import { AppDispatch } from "../store";
export { removeChats } from "../reducers/ChatReducer";

const asyncGetChats = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axios.get("/chat/get-chats");
    dispatch(getChats(data));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Failed to fetch chats");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export { asyncGetChats };
