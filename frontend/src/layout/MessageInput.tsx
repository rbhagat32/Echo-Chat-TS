import { SidebarInput } from "@/components/ui/sidebar";
import { getSocket } from "@/Socket";
import { useSendMessageMutation } from "@/store/api";
import { setMessages } from "@/store/reducers/MessageSlice";
import { Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

export default function MessageInput() {
  const socket = getSocket();
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();

  // fetching required data
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const messages = useSelector((state: StateTypes) => state.messages.messages);

  // extracting receiverId from activeChat
  const receiverId = activeChat.users.find(
    (user: UserTypes) => user._id !== loggedInUser._id
  )?._id;

  // send message functionality
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return toast.error("Message cannot be empty !");

    const newMessage: MessageTypes = {
      _id: `realtime-${uuid().replace(/-/g, "").slice(0, 24)}`,
      chatId: activeChat._id,
      senderId: loggedInUser._id,
      receiverId,
      content: inputMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // reset the input field
    setInputMessage("");

    // emit the message to the server for realtime communication
    if (socket?.connected) socket!.emit("message", newMessage);
    else toast.error("WebSocket connection failed !");

    // send message api call
    try {
      sendMessage(newMessage);
    } catch (error) {
      toast.error("Failed to send message !");
      console.error("Failed to send message:", error);
    }
  };

  // socket listener for incoming realtime messages
  socket?.on("realtime", (msg: MessageTypes) => {
    dispatch(
      setMessages({
        messages: [...messages, msg],
        hasMore: false,
        isMessagesLoading: false,
      })
    );
  });

  return (
    <div className="relative h-14">
      <SidebarInput
        name="message-input-box"
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        placeholder="Type your message here..."
        className="h-14 rounded-t-none rounded-b-xl"
      />
      <button
        onClick={handleSendMessage}
        className="z-[100] absolute right-5 top-1/2 -translate-y-[50%]"
      >
        <Send size="1rem" />
      </button>
    </div>
  );
}
