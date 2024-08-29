import { useEffect, useState } from "react";
import axios from "../utils/axios";

const useGetRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    setLoading(true);
    axios.get("/user/get-requests").then((res) => {
      setRequests(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { loading, requests, fetchRequests };
};

export { useGetRequests };
