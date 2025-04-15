import express from "express";
import { deleteChat, getChats } from "../controllers/chat.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = express.Router();

router.use(isLoggedIn);
router.get("/get-chats", getChats);
router.delete("/delete-chat/:chatId", deleteChat);

export default router;
