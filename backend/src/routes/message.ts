import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { getMessages, sendMessage, deleteMessage } from "../controllers/message.js";

const router = express.Router();

router.use(isLoggedIn);
router.post("/send-message/:chatId", sendMessage);
router.get("/get-messages/:chatId", getMessages);
router.delete("/delete-message/:messageId", deleteMessage);

export default router;
