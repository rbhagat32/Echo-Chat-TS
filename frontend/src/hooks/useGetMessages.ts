import { useEffect, useState } from "react";
import axios from "../utils/axios";

interface PropTypes {
  chatId: string | null;
  page: number;
  limit?: number;
}

const useGetMessages = ({ chatId, page, limit = Infinity }: PropTypes) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `/message/get-messages/${chatId}?page=${page}&limit=${limit}`
      );
      setMessages(data.messages);
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    chatId && fetchMessages();
  }, [chatId, page]);

  return { loading, messages, hasMore, fetchMessages };
};

export { useGetMessages };
