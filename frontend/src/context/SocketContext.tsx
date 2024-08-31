import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useGetUser } from "../hooks/useGetUser";

export const SocketContext = createContext<Socket | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  //   const [onlineUsers, setOnlineUsers] = useState<UserTypes[]>([]);
  const { user } = useGetUser();

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_BACKEND_URL_SOCKET as string);
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, []);

  return (
    <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
  );
};
