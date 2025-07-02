import MessageInput from "./MessageInput";
import Welcome from "@/components/custom/Welcome";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import PageLoader from "@/partials/PageLoader";
import { useLazyGetMessagesQuery } from "@/store/api";
import {
  clearMessages,
  removeMessage,
  prependMessages,
} from "@/store/reducers/MessageSlice";
import { RightClickMenu } from "@/components/custom/RightClickMenu";
import { getSocket } from "@/Socket";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { messageVariants } from "@/lib/variants";

export default function MessageContainer() {
  const socket = getSocket();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const messagesData = useSelector((state: StateTypes) => state.messages);

  const [trigger, remainingData] = useLazyGetMessagesQuery();
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  const fetchAllMessages = async () => {
    try {
      const response = await trigger({
        chatId: activeChat._id,
        page: 1,
        limit: 1000, // Load all at once
      });
      dispatch(prependMessages(response.data!));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Fetch messages when chat changes
  useEffect(() => {
    if (activeChat._id === undefined) return;
    fetchAllMessages();

    return () => {
      dispatch(clearMessages());
    };
  }, [activeChat]);

  // Scroll to bottom after messages load
  useEffect(() => {
    if (messagesData.messages.length > 0) {
      scrollToBottom();
    }
  }, [messagesData.messages]);

  // Scroll to bottom after sending message
  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom]);

  // Real-time delete message via socket
  useEffect(() => {
    const handleRealtimeDeleteMessage = (deletedMessage: MessageTypes) => {
      toast.warning(`${activeChat.users[0].username} deleted a message`);
      dispatch(removeMessage(deletedMessage));
    };

    socket?.on("realtimeDeleteMessage", handleRealtimeDeleteMessage);
    return () => {
      socket?.off("realtimeDeleteMessage", handleRealtimeDeleteMessage);
    };
  }, [socket, dispatch, messagesData]);

  return (
    <div className="rounded-xl bg-muted/50">
      <div
        style={{ height: "calc(100vh - 13.5rem - 1px)" }}
        className="overflow-y-auto p-2"
      >
        {activeChat._id === undefined ? (
          <div className="w-full h-full grid place-items-center">
            <Welcome />
          </div>
        ) : remainingData.isFetching ? (
          <PageLoader />
        ) : messagesData.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Start Chatting.</p>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {messagesData.messages.map((message: MessageTypes) => (
                <motion.div
                  key={message._id}
                  custom={{
                    isMyMessage: message.senderId === loggedInUser._id,
                  }}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                >
                  <RightClickMenu
                    myMessage={message.senderId === loggedInUser._id}
                    message={message}
                  >
                    <div
                      className={`flex gap-2 mb-2 ${
                        message.senderId === loggedInUser._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="max-w-[40ch] md:max-w-[50ch] lg:max-w-[80ch] xl:max-w-[100ch] text-sm px-4 py-2 rounded-md bg-zinc-800">
                        <p className="break-words">{message.content}</p>
                        <p
                          className={`text-[10px] text-zinc-500 flex gap-1 items-center mt-1 ${
                            message.senderId === loggedInUser._id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <span>
                            {moment(message.createdAt).format("hh:mm A")}
                          </span>
                          <span className="mt-px mx-0.5 size-[3px] rounded-full bg-zinc-500"></span>
                          <span>{moment(message.createdAt).fromNow()}</span>
                        </p>
                      </div>
                    </div>
                  </RightClickMenu>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={scrollerRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      {activeChat._id === undefined ? (
        <div className="h-14 rounded-t-none rounded-b-xl" />
      ) : (
        <MessageInput setShouldScrollToBottom={setShouldScrollToBottom} />
      )}
    </div>
  );
}
