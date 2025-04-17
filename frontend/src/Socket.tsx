import { createContext, ReactNode, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(
    () =>
      io(`${import.meta.env.VITE_SOCKET_URL}`, {
        transports: ["websocket"],
        withCredentials: true,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };
