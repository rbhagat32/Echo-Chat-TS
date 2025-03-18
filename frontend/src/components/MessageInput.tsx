import { useState } from "react";
import { TbSend } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { toggleSideBar } from "../store/reducers/MiscSlice";
import axios from "../utils/axios";
import { setMessages } from "../store/reducers/MessagesSlice";
import { getSocket } from "../socket";

const MessageInput = () => {
  const dispatch = useDispatch();
  const { chatId } = useParams<{ chatId: string }>();
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const { isSideBarOpen } = useSelector((state: StateTypes) => state.misc);
  const { messages } = useSelector((state: StateTypes) => state.messages);
  const [message, setMessage] = useState<string>("");
  const socket = getSocket();
  const chats = useSelector((state: StateTypes) => state.chats);
  const receiverId = chats.filter((chat) => chat._id === chatId)[0]?.users[0]
    ?._id;

  const sendMessage = () => {
    if (!message.trim()) return toast.error("Message cannot be empty !");

    const newMessage: MessageTypes = {
      _id: (Math.random() * 1000000).toString(),
      chatId,
      content: message,
      senderId: loggedInUser._id,
      receiverId,
    };

    socket!.emit("message", newMessage);

    dispatch(
      setMessages({
        messages: [...messages, newMessage],
        hasMore: false,
      })
    );

    axios
      .post(`/message/send-message/${chatId}`, { content: message })
      .then(() => {
        setMessage("");
      })
      .catch((error) => {
        toast.error(
          error.response.data.message || "Error while sending message !"
        );
      });
  };

  socket?.on("realtime", (msg: MessageTypes) => {
    dispatch(
      setMessages({
        messages: [...messages, msg],
        hasMore: false,
      })
    );
  });

  return (
    <div
      onClick={() => {
        if (isSideBarOpen) {
          dispatch(toggleSideBar());
        }
      }}
      className="fixed bottom-2.5 w-full h-[60px] bg-zinc-900 p-2"
    >
      <input
        name="message-input-box"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Type your message here..."
        className="w-full h-full bg-zinc-800 px-4 rounded-lg placeholder:text-zinc-500"
      />
      <button
        onClick={sendMessage}
        className="z-[100] absolute right-5 top-1/2 -translate-y-[50%] text-xl text-white bg-zinc-800"
      >
        <TbSend />
      </button>
    </div>
  );
};

export default MessageInput;
