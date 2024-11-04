import express from "express";
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
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket: AuthenticatedSocket) => {
  const user = socket.user!;
  userSocketsMap.set(user._id.toString(), socket.id);

  console.log(userSocketsMap);

  socket.on("disconnect", () => {
    console.log("User Disconnected :", socket.id);
  });
});

export { app, server, io };
