import { NextFunction, Response } from "express";
import { RequestWithUser } from "../types/user.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants/cookie-options.js";
import { UserModel } from "../models/user.js";

interface JwtPayloadTypes {
  userId: string;
  iat: number;
  exp: number;
}

const isLoggedIn = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Please login to continue !" });

    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayloadTypes;
    const user = await UserModel.findById(loggedInUser.userId);

    if (!user) {
      return res
        .status(401)
        .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
        .json({ message: "Session expired. Please login again !" });
    }

    req.userId = loggedInUser.userId;
    next();
  } catch {
    return res
      .status(401)
      .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
      .json({ message: "Session expired. Please login again !" });
  }
};

export { isLoggedIn };
