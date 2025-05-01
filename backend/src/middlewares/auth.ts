import { NextFunction, Response } from "express";
import { RequestWithUser, UserTypes } from "../types/user.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants/cookie-options.js";

const isLoggedIn = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Please login to continue !" });

    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    req.user = loggedInUser as UserTypes;
    next();
  } catch (error) {
    return res
      .status(401)
      .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
      .json({ message: "Session expired. Please login !" });
  }
};

export { isLoggedIn };
