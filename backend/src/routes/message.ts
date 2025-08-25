import express from "express";
import { isLoggedIn } from "../middlewares/auth.js";
import { getMessages, sendMessage, deleteMessage, uploadImage } from "../controllers/message.js";
import { multerUpload } from "../config/multer.js";

const router = express.Router();

router.use(isLoggedIn);
router.post("/send-message/:chatId", sendMessage);
router.post("/upload-image", multerUpload.single("image"), uploadImage);
router.get("/get-messages/:chatId", getMessages);
router.delete("/delete-message/:messageId", deleteMessage);

export default router;
