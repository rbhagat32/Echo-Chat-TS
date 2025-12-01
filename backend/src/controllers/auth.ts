import { Request, Response } from "express";
import { cookieOptions } from "../constants/cookie-options.js";
import { ErrorHandler } from "../middlewares/error-handler.js";
import { UserModel } from "../models/user.js";
import { FileProps } from "../types/file.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generate-token.js";
import { tryCatch } from "../utils/try-catch.js";

const checkLoggedIn = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ isLoggedIn: false });
  if (token) return res.status(200).json({ isLoggedIn: true });
};

const signUp = tryCatch(async (req: Request, res: Response) => {
  const { username, password, bio } = req.body;
  const avatar = req.file;

  if (!username?.trim() || !password?.trim())
    throw new ErrorHandler(400, "All fields are required !");

  if (bio.trim().length > 50) throw new ErrorHandler(400, "Bio must be less than 50 characters !");

  const existingUsername = await UserModel.findOne({ username });
  if (existingUsername) throw new ErrorHandler(400, "Username already taken !");

  // avatar upload to cloudinary
  const { public_id, url } = await uploadToCloudinary(avatar as FileProps);

  const createdUser = await UserModel.create({
    username,
    password,
    bio,
    avatar: { public_id, url },
  });

  if (createdUser) {
    generateToken(res, createdUser);
    return res.status(201).json({ message: "Account created successfully !" });
  }
});

const login = tryCatch(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username.trim() || !password.trim())
    throw new ErrorHandler(400, "All fields are required !");

  const user = await UserModel.findOne({ username }).select("+password");

  if (!user) throw new ErrorHandler(401, "Invalid username or password !");

  const result = await user.matchPassword(password);
  if (!result) throw new ErrorHandler(401, "Invalid username or password !");

  generateToken(res, user);
  return res.status(200).json({ message: `Welcome ${username} !` });
});

const logout = (_req: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
    .json({ message: "Logged out successfully !" });
};

export { checkLoggedIn, login, logout, signUp };
