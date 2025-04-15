import { Socket } from "socket.io";
import { UserTypes } from "./user.js";

export interface AuthenticatedSocket extends Socket {
  user?: UserTypes;
}
