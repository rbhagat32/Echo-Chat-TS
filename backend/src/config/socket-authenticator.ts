import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import dotenv from "dotenv";
import { NextFunction } from "express";
import { AuthenticatedSocket } from "../types/socket.js";

dotenv.config({ path: "./.env" });

interface DecodedData {
  userId: string;
}

const socketAuthenticator = async (
  err: any,
  socket: AuthenticatedSocket,
  next: NextFunction
) => {
  try {
    if (err) return next(new Error("Authentication Error"));

    const token = (socket.request as any).cookies?.token;
    if (!token) return next(new Error("Authentication Error"));

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedData;

    const user = await userModel.findById(decodedData.userId);
    if (!user) return next(new Error("Authentication Error"));
    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new Error("Authentication Error !"));
  }
};

export { socketAuthenticator };
