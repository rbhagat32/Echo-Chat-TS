import MessageInput from "./MessageInput";
import Welcome from "@/components/custom/Welcome";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import PageLoader from "@/partials/PageLoader";
import { useLazyGetMessagesQuery } from "@/store/api";
import { clearMessages, removeMessage, prependMessages } from "@/store/reducers/MessageSlice";
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
        limit: -1,
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
    <div className="bg-muted/50 rounded-xl">
      <div style={{ height: "calc(100vh - 13.5rem - 1px)" }} className="overflow-y-auto p-2">
        {activeChat._id === undefined ? (
          <div className="grid h-full w-full place-items-center">
            <Welcome />
          </div>
        ) : remainingData.isFetching ? (
          <PageLoader />
        ) : messagesData.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
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
                  <div
                    className={`mb-2 flex gap-2 ${
                      message.senderId === loggedInUser._id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <RightClickMenu
                      myMessage={message.senderId === loggedInUser._id}
                      message={message}
                    >
                      <div className="max-w-[40ch] rounded-md bg-zinc-800 px-4 py-2 text-sm md:max-w-[50ch] lg:max-w-[80ch] xl:max-w-[100ch]">
                        <p className="break-words">{message.content}</p>
                        <p
                          className={`mt-1 flex items-center gap-1 text-[10px] text-zinc-500 ${
                            message.senderId === loggedInUser._id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span>{moment(message.createdAt).format("hh:mm A")}</span>
                          <span className="mx-0.5 mt-px size-[3px] rounded-full bg-zinc-500"></span>
                          <span>{moment(message.createdAt).fromNow()}</span>
                        </p>
                      </div>
                    </RightClickMenu>
                  </div>
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
