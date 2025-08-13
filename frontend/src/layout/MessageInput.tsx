import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Send } from "lucide-react";
import { SidebarInput } from "@/components/ui/sidebar";
import { getSocket } from "@/Socket";
import { api, useSendMessageMutation } from "@/store/api";
import { appendMessage } from "@/store/reducers/MessageSlice";
import { appendLatestChat } from "@/store/reducers/LatestChatSlice";
import { ImageUpload } from "@/components/custom/ImageUpload";

interface PropTypes {
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}

function MessageInputComponent({ setShouldScrollToBottom }: PropTypes) {
  const dispatch = useDispatch();
  const socket = getSocket();
  const [sendMessage] = useSendMessageMutation();

  // fetching required data
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const chats = useSelector((state: StateTypes) => state.chats);

  // extracting receiverId from activeChat
  const receiverId = activeChat.users.find((user: UserTypes) => user._id !== loggedInUser._id)?._id;

  // send message functionality
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return toast.error("Message cannot be empty !");

    // for scrolling to the bottom of the chat window when new message is sent
    setShouldScrollToBottom(true);

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

    // send message api call
    sendMessage(newMessage);
  };

  // socket listener for realtime messages
  useEffect(() => {
    const handleRealtimeMessage = async (msg: MessageTypes) => {
      // for scrolling to the bottom of the chat window when new message is received
      setShouldScrollToBottom(true);

      // Check if the message belongs to the active chat and sender is NOT loggedInUser
      if (msg.chatId === activeChat._id && msg.senderId !== loggedInUser._id) {
        dispatch(appendMessage(msg));
      } else {
        // If message doesn't belong to active chat, update chats and latest chats

        // refetch chats in order of latest message when realtime message is received
        const refetchChatsPromise = dispatch(api.util.invalidateTags(["Chats"]));

        // append the chat to latest chats
        const appendLatestChatPromise = chats
          .filter((chat: ChatTypes) => chat._id === msg.chatId)
          .map((chat) => dispatch(appendLatestChat(chat)));

        // wait for all dispatches to complete
        await Promise.all([refetchChatsPromise, ...appendLatestChatPromise]);
      }
    };

    socket?.on("realtime", handleRealtimeMessage);

    return () => {
      // cleanup socket listener on component unmount or dependencies change
      socket?.off("realtime", handleRealtimeMessage);
    };
  }, [activeChat, socket, dispatch, loggedInUser._id, chats]);

  return (
    <div className="flex h-14 items-center gap-4">
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
        className="h-14 rounded-t-none rounded-b-xl break-words"
      />

      <div className="mr-4 flex items-center gap-1">
        <ImageUpload />

        <button
          onClick={handleSendMessage}
          className="rounded-md p-2 duration-300 hover:bg-zinc-700"
        >
          <Send size="1.2rem" />
        </button>
      </div>
    </div>
  );
}

// Memoizing the component to prevent unnecessary re-renders
const MessageInput = memo(MessageInputComponent);
export default MessageInput;
