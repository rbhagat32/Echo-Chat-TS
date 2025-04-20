import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Send } from "lucide-react";
import { SidebarInput } from "@/components/ui/sidebar";
import { getSocket } from "@/Socket";
import { useSendMessageMutation } from "@/store/api";
import { appendMessage } from "@/store/reducers/MessageSlice";
import { appendLatestChat } from "@/store/reducers/LatestChatSlice";

function MessageInputComponent() {
  const dispatch = useDispatch();
  const socket = getSocket();
  const [sendMessage] = useSendMessageMutation();

  // fetching required data
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const chats = useSelector((state: StateTypes) => state.chats);

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
    socket?.emit("message", newMessage);

    // send message api call
    try {
      sendMessage(newMessage);
    } catch (error) {
      toast.error("Failed to send message !");
      console.error("Failed to send message:", error);
    }
  };

  // socket listener for realtime messages
  // on cleanup, remove the listener to prevent memory leaks

  useEffect(() => {
    const handleRealtimeMessage = (msg: MessageTypes) => {
      // check if the message belongs to the active chat
      if (msg.senderId === activeChat.users[0]._id) {
        dispatch(appendMessage(msg));
      } else {
        // if the message does not belong to the active chat, append it to the latest chats
        chats.forEach((chat: ChatTypes) => {
          if (chat._id === msg.chatId) {
            dispatch(appendLatestChat(chat));
          }
        });
      }
    };

    socket?.on("realtime", handleRealtimeMessage);

    return () => {
      socket?.off("realtime", handleRealtimeMessage);
    };

    // re-render when activeChat changes so that we can append the messages to the correct chat
  }, [activeChat, socket, dispatch]);

  return (
    <div className="relative h-14">
      <SidebarInput
        name="message-input-box"
        type="text"
        autoComplete="off"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        placeholder="Type your message here..."
        className="h-14 rounded-t-none rounded-b-xl pr-16 break-words"
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

// Memoizing the component to prevent unnecessary re-renders
const MessageInput = memo(MessageInputComponent);
export default MessageInput;
