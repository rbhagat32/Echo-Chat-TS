import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { NextFunction } from "express";
import { AuthenticatedSocket } from "../types/socket.js";

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

    const token = socket.request.cookies?.token;
    if (!token) return next(new Error("Authentication Error"));

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedData;

    socket.user = await userModel.findById(decodedData.userId);

    return next();
  } catch (error) {
    console.log(error);
    return next(new Error("Authentication Error !"));
  }
};

export { socketAuthenticator };
