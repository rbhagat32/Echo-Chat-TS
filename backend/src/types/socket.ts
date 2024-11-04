import { Socket } from "socket.io";
import userModel from "../models/user.js";

export interface AuthenticatedSocket extends Socket {
  user?: typeof userModel;
}
