import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
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

io.on("connection", (socket) => {
  console.log("User Connected :", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected :", socket.id);
  });
});

export { app, server, io };
