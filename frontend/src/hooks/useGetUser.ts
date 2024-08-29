import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { asyncGetUser } from "../store/actions/UserActions";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../store/store";

const useGetUser = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.UserReducer.user);

  useEffect(() => {
    const checkBackend = () => {
      axios
        .get("/auth/check")
        .then((response) => {
          if (response.data.isLoggedIn) {
            dispatch(asyncGetUser())
              .then(() => {
                setLoading(false);
                clearInterval(intervalId); // Stop further attempts once successful
              })
              .catch((error) => {
                toast.error(error?.message);
              });
          } else {
            toast.error("Please login to continue!");
            navigate("/login");
            clearInterval(intervalId); // Stop further attempts if not logged in
          }
        })
        .catch(() => {
          toast.error(
            "It usually takes 50 seconds to start the backend server. We will keep trying !"
          );
        });
    };

    const intervalId = setInterval(checkBackend, 30000); // Check every 30 seconds

    // Run the check immediately on mount
    checkBackend();

    return () => {
      clearInterval(intervalId); // Cleanup the interval on unmount
    };
  }, [dispatch, navigate]);

  return { loading, user };
};

export { useGetUser };
