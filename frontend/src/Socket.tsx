import { createContext, ReactNode, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.DEV ? import.meta.env.VITE_SOCKET_URL : "wss://chat.void9.space";

const SocketContext = createContext<Socket | null>(null);

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(
    () =>
      io(SOCKET_URL as string, {
        transports: ["websocket"],
        withCredentials: true,
      }),
    []
  );

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export { SocketProvider, getSocket };
