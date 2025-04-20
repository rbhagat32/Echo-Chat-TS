import { getSocket } from "@/Socket";
import { appendLatestChat } from "@/store/reducers/LatestChatSlice";
import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function WelcomeComponent() {
  const socket = getSocket();
  const dispatch = useDispatch();

  const chats = useSelector((state: StateTypes) => state.chats);

  // socket listener for realtime messages
  useEffect(() => {
    const handleRealtimeMessage = (msg: MessageTypes) => {
      chats.forEach((chat: ChatTypes) => {
        if (chat._id === msg.chatId) {
          dispatch(appendLatestChat(chat));
        }
      });
    };

    socket?.on("realtime", handleRealtimeMessage);

    return () => {
      // on cleanup, remove the socket listener
      socket?.off("realtime", handleRealtimeMessage);
    };

    // re-render when activeChat changes so that we can append the messages to the correct chat
  }, [chats, socket, dispatch]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <img src="/logo-light.svg" alt="Logo" className="size-40" />
      <h1 className="text-3xl font-semibold">Echo.</h1>
      <p className="text-zinc-500 max-w-[38ch] text-justify">
        "Welcome back! Ready to dive into your conversations? Connect with
        friends, share moments, and enjoy seamless communication all in one
        place."
      </p>
    </div>
  );
}

const Welcome = memo(WelcomeComponent);
export default Welcome;
