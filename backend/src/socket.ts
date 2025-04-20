import express, { NextFunction, Request } from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "./config/socket-authenticator.js";
import { AuthenticatedSocket } from "./types/socket.js";
import { UserTypes } from "./types/user.js";

dotenv.config({ path: "./.env" });

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      `${process.env.FRONTEND_URL_DEV}`,
      `${process.env.FRONTEND_URL_PROD}`,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const userSocketsMap = new Map<string, string>();

io.use((socket, next) => {
  cookieParser()(
    socket.request as Request,
    (socket.request as Request & { res: any }).res,
    async (err) => await socketAuthenticator(err, socket, next as NextFunction)
  );
});

io.on("connection", (socket: AuthenticatedSocket) => {
  const user = socket.user as UserTypes;
  const userId = user._id.toString();

  userSocketsMap.set(userId, socket.id);

  socket.on("message", (message) => {
    const receiverSocketId = userSocketsMap.get(message.receiverId.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtime", message);
      console.log(
        `Realtime message sent to ${message.receiverId} : ${message.content}`
      );
    } else {
      console.log(`Other user: ${message.receiverId} is not online`);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`User ${user.username} disconnected: ${reason}`);
    userSocketsMap.delete(userId);
  });
});

export { app, server, io };
