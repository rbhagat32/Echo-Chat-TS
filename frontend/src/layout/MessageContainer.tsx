import MessageInput from "./MessageInput";
import Welcome from "@/components/custom/Welcome";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useRef } from "react";
import PageLoader from "@/partials/PageLoader";
import { useLazyGetMessagesQuery } from "@/store/api";
import { clearMessages } from "@/store/reducers/MessageSlice";

export default function MessageContainer() {
  const dispatch = useDispatch();

  // fetching required data from redux store
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const activeChat = useSelector((state: StateTypes) => state.activeChat);
  const messagesData = useSelector((state: StateTypes) => state.messages);

  // fetching messages for the active chat
  const [trigger, remainingData] = useLazyGetMessagesQuery();
  useEffect(() => {
    if (activeChat._id === undefined) return;
    const fetchMessages = async () => {
      try {
        await trigger({ chatId: activeChat._id });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
    return () => {
      // clear messages from redux store when activeChat is changed
      dispatch(clearMessages());
    };
  }, [activeChat]);

  // Scroll to bottom when messages are displayed
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollIntoView();
    }
  };
  useEffect(() => {
    if (messagesData?.messages?.length) {
      scrollToBottom();
    }
  }, [messagesData]);

  return (
    // Container for messages and input box
    <div className="rounded-xl bg-muted/50">
      {/* Messages container with fixed height */}
      <div
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
        remainingData.isFetching ? (
          // if messages are loading show PageLoader
          <PageLoader fullScreen={false} />
        ) : // else check no. of messages
        messagesData?.messages?.length == 0 ? (
          // if no. of messages =0
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-500">Start Chatting.</p>
          </div>
        ) : (
          // if no. of messages is >0
          <>
            {messagesData?.messages?.map((message: MessageTypes) => (
              <div
                key={message._id}
                className={`flex gap-2 mb-2 ${
                  loggedInUser._id === message.senderId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={
                    "max-w-[85%] md:max-w-[70%] lg:max-w-[60%] text-sm px-4 py-2 rounded-md bg-zinc-800"
                  }
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-[10px] text-zinc-500 flex gap-1 items-center mt-1 ${
                      loggedInUser._id === message.senderId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <span>{moment(message.createdAt).format("hh:mm A")}</span>
                    <span className="mt-px mx-0.5 size-[3px] rounded-full bg-zinc-500"></span>
                    <span>{moment(message.createdAt).fromNow()}</span>
                  </p>
                </div>
              </div>
            ))}

            {/* Scroll to bottom */}
            <div ref={scrollerRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      {activeChat!._id === undefined ? (
        <div className="h-14 rounded-t-none rounded-b-xl" />
      ) : (
        <MessageInput />
      )}
    </div>
  );
}
