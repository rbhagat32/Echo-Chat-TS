import { Request, Response } from "express";
import { cookieOptions } from "../constants/cookie-options.js";
import userModel from "../models/user.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generate-token.js";
import { FileProps } from "../types/file.js";
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
    throw Object.assign(new Error("All fields are required !"), {
      statusCode: 400,
    });

  if (bio.trim().length > 50)
    throw Object.assign(new Error("Bio must be less than 50 characters !"), {
      statusCode: 400,
    });

  const existingUsername = await userModel.findOne({ username });
  if (existingUsername)
    throw Object.assign(new Error("Username already taken !"), {
      statusCode: 400,
    });

  // avatar upload to cloudinary
  const { public_id, url } = await uploadToCloudinary(avatar as FileProps);

  const createdUser = await userModel.create({
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
    throw Object.assign(new Error("All fields are required !"), {
      statusCode: 400,
    });

  const user = await userModel.findOne({ username }).select("+password");

  if (!user)
    throw Object.assign(new Error("Invalid username or password !"), {
      statusCode: 401,
    });

  const result = await user.matchPassword(password);
  if (!result)
    throw Object.assign(new Error("Invalid username or password !"), {
      statusCode: 401,
    });

  generateToken(res, user);
  return res.status(200).json({ message: `Welcome ${username} !` });
});

const logout = (_req: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
    .json({ message: "Logged out successfully !" });
};

export { checkLoggedIn, signUp, login, logout };
