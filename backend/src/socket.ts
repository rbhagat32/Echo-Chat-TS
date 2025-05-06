import express, { NextFunction, Request } from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { socketAuthenticator } from "./config/socket-authenticator.js";
import { AuthenticatedSocket } from "./types/socket.js";
import { UserTypes } from "./types/user.js";
import { ChatTypes } from "./types/chat.js";
import { MessageTypes } from "./types/message.js";

dotenv.config({ path: ".env" });

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.FRONTEND_URL_DEV}`, `${process.env.FRONTEND_URL_PROD}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// app.set("io", io); -> this can be used to access io in controllers by doing
// const io = req.app.get("io");
// but we are directly exporting io from this file and importing it in controllers

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

  io.emit("onlineUsers", Array.from(userSocketsMap.keys()));

  socket.on("message", (message) => {
    const receiverSocketId = userSocketsMap.get(message.receiverId.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtime", message);
      // console.log(
      //   `Realtime message sent to ${message.receiverId}: ${message.content}`
      // );
    } else {
      // console.log(`Other user: ${message.receiverId} is not online`);
    }
  });

  socket.on("deleteChat", (loggedInUser: UserTypes, deletedChat: ChatTypes) => {
    const receiverSocketId = userSocketsMap.get(deletedChat.users[0]._id.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtimeDeleteChat", loggedInUser, deletedChat);
      // console.log(
      //   `${loggedInUser._id} deleted chat with ${deletedChat.users[0]._id}`
      // );
    } else {
      // console.log(`Other user: ${deletedChat.users[0]._id} is not online`);
    }
  });

  socket.on("request", (loggedInUser: UserTypes, user: UserTypes) => {
    const receiverSocketId = userSocketsMap.get(user._id.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtimeRequest", loggedInUser);
      // console.log(`Realtime request from ${loggedInUser._id} to ${user._id}`);
    } else {
      // console.log(`Other user: ${user._id} is not online`);
    }
  });

  socket.on("accept", (loggedInUser: UserTypes, user: UserTypes) => {
    const receiverSocketId = userSocketsMap.get(user._id.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtimeAccept", loggedInUser);
      // console.log(`Realtime accept from ${loggedInUser._id} to ${user._id}`);
    } else {
      // console.log(`Other user: ${user._id} is not online`);
    }
  });

  socket.on("reject", (loggedInUser: UserTypes, user: UserTypes) => {
    const receiverSocketId = userSocketsMap.get(user._id.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtimeReject", loggedInUser);
      // console.log(`Realtime reject from ${loggedInUser._id} to ${user._id}`);
    } else {
      // console.log(`Other user: ${user._id} is not online`);
    }
  });

  socket.on("deleteMessage", (message: MessageTypes) => {
    const receiverSocketId = userSocketsMap.get(message.receiverId.toString());
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("realtimeDeleteMessage", message);
      // console.log(
      //   `${message.senderId} deleted message with ${message.receiverId}`
      // );
    } else {
      // console.log(`Other user: ${message.receiverId} is not online`);
    }
  });

  // when socket.disconnect() is called on client side, this event is triggered
  // reason for disconnect is received as a parameter is place of _
  socket.on("disconnect", (_) => {
    // console.log(`User: ${user.username}, Disconnected: ${reason}`);
    userSocketsMap.delete(userId);
    io.emit("onlineUsers", Array.from(userSocketsMap.keys()));
  });
});

export { app, server, io, userSocketsMap };
