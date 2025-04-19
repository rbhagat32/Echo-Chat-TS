import { SidebarInput } from "@/components/ui/sidebar";
import { getSocket } from "@/Socket";
import { useSendMessageMutation } from "@/store/api";
import { Send } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

export default function MessageInput() {
  const socket = getSocket();
  const [sendMessage] = useSendMessageMutation();

  // fetching required data
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);

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
    else console.error("WebSocket connection failed !");

    // send message api call
    try {
      sendMessage(newMessage);
    } catch (error) {
      toast.error("Failed to send message !");
      console.error("Failed to send message:", error);
    }
  };

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
        className="z-[100] absolute right-5 top-1/2 -translate-y-[50%] pl-1.5 pr-2 py-2 rounded-md hover:bg-zinc-700 duration-300"
      >
        <Send size="1rem" />
      </button>
    </div>
  );
}
