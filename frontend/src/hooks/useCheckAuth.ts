import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const useCheckAuth = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get("/auth/check").then((response) => {
      response?.data?.isLoggedIn ? navigate("/") : setLoading(false);
    });
  }, []);

  return { loading, setLoading };
};

export { useCheckAuth };
