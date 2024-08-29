import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { asyncGetChats } from "../store/actions/ChatActions";
import { AxiosError } from "axios";
import { AppDispatch, RootState } from "../store/store";

const useGetChats = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const chats = useSelector((state: RootState) => state.ChatReducer.chats);

  const fetchChats = () => {
    setLoading(true);
    dispatch(asyncGetChats())
      .then(() => {
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message || "Failed to load chats");
        } else {
          toast.error("An unexpected error occurred");
        }
        navigate("/login");
      });
  };

  useEffect(() => {
    fetchChats();
  }, [dispatch, navigate]);

  return { loading, chats, fetchChats };
};

export { useGetChats };
