import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageLoader from "../partials/PageLoader";
import { api, useGetMessagesQuery } from "../store/api";
import { clearMessages } from "../store/reducers/MessagesSlice";
import moment from "moment";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: StateTypes) => state.user);

  let page = 1;
  let limit = Infinity;
  const { chatId } = useParams<{ chatId: string }>();
  const { isLoading, isFetching, data } = useGetMessagesQuery({
    chatId,
    page,
    limit,
  });

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
    if (!isFetching && data?.messages?.length) {
      scrollToBottom();
    }
  }, [data, isFetching]);

  return (
    !isLoading && (
      <div
        // will change to -140px for send message input
        style={{ height: "calc(100vh - 80px)" }}
        className="overflow-auto relative top-20"
      >
        {isFetching ? (
          <div className="relative -top-20">
            <PageLoader />
          </div>
        ) : data?.messages?.length ? (
          <>
            {data?.messages?.map((message: MessageTypes) => (
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
                    "px-3 py-2 rounded-md bg-zinc-800 flex gap-5 items-end"
                  }
                >
                  <p>{message.content}</p>
                  <small className="text-[10px] text-zinc-500">
                    {moment(message.createdAt).fromNow()}
                  </small>
                </div>
              </div>
            ))}

            <div ref={scrollerRef} />
          </>
        ) : (
          <div className="relative -top-20 h-screen grid place-items-center text-center">
            <p className="text-lg">Start Chatting !</p>
          </div>
        )}
      </div>
    )
  );
};

export default MessageContainer;
