import MessageInput from "./MessageInput";
import Welcome from "@/components/custom/Welcome";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PageLoader from "@/partials/PageLoader";
import { useLazyGetMessagesQuery } from "@/store/api";
import {
  clearMessages,
  prependMessages,
  removeMessage,
} from "@/store/reducers/MessageSlice";
import { RightClickMenu } from "@/components/custom/RightClickMenu";
import { getSocket } from "@/Socket";
import { toast } from "sonner";
import InfiniteScroll from "@/components/custom/InfiniteScroll";
import { motion, AnimatePresence } from "motion/react";
import { messageVariants } from "@/lib/variants";

export default function MessageContainer() {
  const socket = getSocket();
  const dispatch = useDispatch();

  const [page, setPage] = useState<number>(1);
  const isFetchingMore = useRef(false);

  // fetching required data from redux store
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const messagesData = useSelector((state: StateTypes) => state.messages);

  // fetching messages for the active chat
  const [trigger, remainingData] = useLazyGetMessagesQuery();
  const fetchMessages = async () => {
    if (rootDivRef.current)
      previousScrollHeightRef.current = rootDivRef.current.scrollHeight;

    isFetchingMore.current = true;

    try {
      const response = await trigger({
        chatId: activeChat._id,
        page: page,
        limit: 25,
      });
      setPage((prev) => prev + 1);
      dispatch(prependMessages(response.data!));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (activeChat._id === undefined) return;
    fetchMessages();
    return () => {
      // reset page to 1 when activeChat changes
      setPage(1);

      // clear messages from redux store when activeChat is changed
      dispatch(clearMessages());
    };
  }, [activeChat]);

  // Scroll to bottom when messages are displayed
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] =
    useState<boolean>(false);

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    if (shouldScrollToBottom === true) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [remainingData.isLoading, shouldScrollToBottom]);

  // socket listener for realtime delete message
  useEffect(() => {
    const handleRealtimeDeleteMessage = async (
      deletedMessage: MessageTypes
    ) => {
      // DO NOT set shouldScrollToBottom here to prevent scroll on delete
      toast.warning(`${activeChat.users[0].username} deleted a message`);
      dispatch(removeMessage(deletedMessage));
    };

    socket?.on("realtimeDeleteMessage", handleRealtimeDeleteMessage);

    return () => {
      // on cleanup, remove the socket listener
      socket?.off("realtimeDeleteMessage", handleRealtimeDeleteMessage);
    };
  }, [socket, dispatch, messagesData]);

  // for infinite scroll
  const rootDivRef = useRef<HTMLDivElement>(null);
  const topDivRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (
      rootDivRef.current &&
      previousScrollHeightRef.current &&
      isFetchingMore.current
    ) {
      const container = rootDivRef.current;
      const scrollHeightDiff =
        container.scrollHeight - previousScrollHeightRef.current;
      container.scrollTop = scrollHeightDiff;
      isFetchingMore.current = false;
    }
  }, [messagesData.messages]);

  return (
    // Container for messages and input box
    <div className="rounded-xl bg-muted/50">
      {/* Messages container with fixed height */}
      <div
        ref={rootDivRef}
        style={{ height: "calc(100vh - 13.5rem - 1px)" }}
        className="overflow-y-auto p-2"
      >
        {/* check if any chat is selected or not */}
        {activeChat!._id === undefined ? (
          // if no chat is selected
          <div className="w-full h-full grid place-items-center">
            <Welcome />
          </div>
        ) : // if some chat is selected, check if messages are loading or not
        remainingData.isLoading ? (
          // if messages are loading show PageLoader
          <PageLoader />
        ) : // else check no. of messages
        messagesData?.messages?.length == 0 ? (
          // if no. of messages =0
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Start Chatting.</p>
          </div>
        ) : (
          // if no. of messages is >0
          <>
            <InfiniteScroll
              hasMore={messagesData.hasMore}
              isLoading={remainingData.isFetching}
              next={fetchMessages}
              reverse={true}
              root={rootDivRef.current}
            >
              <div ref={topDivRef} />
            </InfiniteScroll>

            <AnimatePresence initial={false}>
              {messagesData?.messages?.map((message: MessageTypes) => (
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
                      <div
                        className={
                          "max-w-[40ch] md:max-w-[50ch] lg:max-w-[80ch] xl:max-w-[100ch] text-sm px-4 py-2 rounded-md bg-zinc-800"
                        }
                      >
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

            {/* Scroll to bottom */}
            <div ref={scrollerRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      {activeChat!._id === undefined ? (
        <div className="h-14 rounded-t-none rounded-b-xl" />
      ) : (
        <MessageInput setShouldScrollToBottom={setShouldScrollToBottom} />
      )}
    </div>
  );
}
