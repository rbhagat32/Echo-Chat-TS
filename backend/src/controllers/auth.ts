import { Request, Response } from "express";
import { cookieOptions } from "../constants/cookieOptions.js";
import userModel from "../models/user.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";
import { FileProps } from "../types/file.js";

const checkLoggedIn = (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) return res.status(200).json({ isLoggedIn: false });
  if (token) return res.status(200).json({ isLoggedIn: true });
};

const signUp = async (req: Request, res: Response) => {
  const { username, password, bio } = req.body;
  const avatar = req.file;

  if (!username.trim() || !password.trim())
    return res.status(400).json({ message: "All fields are required !" });

  if (bio.trim().length > 50)
    return res
      .status(400)
      .json({ message: "Bio must be less than 50 characters !" });

  try {
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername)
      return res.status(401).json({ message: "Username already taken !" });

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

      return res
        .status(201)
        .json({ message: "Account created successfully !" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error !" });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username.trim() || !password.trim())
    return res.status(400).json({ message: "All fields are required !" });

  try {
    const user = await userModel.findOne({ username }).select("+password");

    if (!user)
      return res.status(404).json({ message: "User does not exist !" });

    const result = await user.matchPassword(password);
    if (!result) {
      return res.status(400).json({ message: "Wrong password !" });
    }

    generateToken(res, user);

    return res.status(200).json({ message: `Welcome ${username} !` });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error !" });
  }
};

const logout = (_: Request, res: Response) => {
  res
    .status(200)
    .cookie("token", "", { ...cookieOptions, expires: new Date(Date.now()) })
    .json({ message: "Logged out successfully !" });
};

export { checkLoggedIn, signUp, login, logout };
