import { useEffect, useRef, useState } from "react";
import { useGetMessages } from "../hooks/useGetMessages";
import Loader from "../partials/Loader";
import moment from "moment";
import { IoSend } from "react-icons/io5";
import axios from "../utils/axios";

export default function MessageContainer({
  loggedInUser,
  chatId,
}: {
  loggedInUser: UserTypes;
  chatId: string;
}) {
  const { loading, messages, fetchMessages } = useGetMessages({
    chatId,
    page: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const [messageToBeSent, setMessageToBeSent] = useState("");
  const sendMessage = () => {
    axios
      .post(`/message/send-message/${chatId}`, {
        content: messageToBeSent,
      })
      .then(() => {
        setMessageToBeSent("");
        fetchMessages();
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="relative w-full h-full overflow-auto">
      <div className="flex flex-col gap-2 pb-14 pr-3">
        {messages.length <= 0 ? (
          <h1>No messages yet!</h1>
        ) : (
          messages.map((message: MessageTypes) => (
            <div
              key={message._id}
              className={`flex gap-3 items-center ${
                loggedInUser._id === message.senderId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="relative bg-backgroundLight px-5 py-2 rounded-lg">
                <p className="text-xl">{message.content}</p>
                <small className="text-xs text-neutral-500">
                  {moment(message.createdAt).fromNow()}
                </small>
              </div>
            </div>
          ))
        )}

        {/* Empty div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed w-[67%] bottom-4 flex items-center gap-5">
        <input
          value={messageToBeSent}
          onChange={(e) => setMessageToBeSent(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Message :"
          className="w-full px-4 py-2.5 rounded-md bg-backgroundLight border-2 border-white placeholder:text-white outline-none"
        />
        <button onClick={sendMessage} className="absolute right-5">
          <IoSend />
        </button>
      </div>
    </div>
  );
}
