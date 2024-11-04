import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageLoader from "../partials/PageLoader";
import { api, useGetMessagesQuery } from "../store/api";
import { clearMessages } from "../store/reducers/MessagesSlice";
import moment from "moment";
import MessageInput from "../components/MessageInput";
import { toggleSideBar } from "../store/reducers/MiscSlice";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: StateTypes) => state.user);
  const { isSideBarOpen } = useSelector((state: StateTypes) => state.misc);

  let page = 1;
  let limit = Infinity;
  const { chatId } = useParams<{ chatId: string }>();
  const { isLoading, isFetching } = useGetMessagesQuery({
    chatId,
    page,
    limit,
  });

  const messages = useSelector((state: StateTypes) => state.messages);

  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    dispatch(api.util.invalidateTags(["Message"]));
    return () => {
      dispatch(clearMessages());
    };
  }, [chatId]);

  useEffect(() => {
    if (!isFetching && messages?.messages?.length) {
      scrollToBottom();
    }
  }, [messages, isFetching]);

  return (
    !isLoading && (
      <>
        <div
          onClick={() => {
            if (isSideBarOpen) {
              dispatch(toggleSideBar());
            }
          }}
          style={{ height: "calc(100vh - 140px)" }}
          className="overflow-auto relative top-20"
        >
          {isFetching ? (
            <div className="relative -top-20">
              <PageLoader />
            </div>
          ) : messages?.messages?.length ? (
            <>
              {messages?.messages?.map((message: MessageTypes) => (
                <div
                  key={message._id}
                  className={`flex gap-2 mb-2 mx-2 ${
                    loggedInUser._id === message.senderId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={
                      "max-w-[85%] md:max-w-[70%] lg:max-w-[60%] text-sm px-3 py-2 rounded-md bg-zinc-800"
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

              <div ref={scrollerRef} />
            </>
          ) : (
            <div className="relative -top-20 h-screen grid place-items-center text-center">
              <p className="text-lg">No Messages Yet !</p>
            </div>
          )}
        </div>

        <MessageInput />
      </>
    )
  );
};

export default MessageContainer;
