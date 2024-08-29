import { Response } from "express";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants/cookieOptions.js";

interface User {
  _id: string;
}

const generateToken = (res: Response, user: User) => {
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "15d",
    }
  );

  res.cookie("token", token, cookieOptions);
};

export { generateToken };
