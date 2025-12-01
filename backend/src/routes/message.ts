import express from "express";
import { multerUpload } from "../config/multer.js";
import { deleteMessage, getMessages, sendMessage, uploadImage } from "../controllers/message.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = express.Router();

router.use(isLoggedIn);
router.post("/send-message/:chatId", sendMessage);
router.post("/upload-image", multerUpload.single("image"), uploadImage);
router.get("/get-messages/:chatId", getMessages);
router.delete("/delete-message/:messageId", deleteMessage);

export default router;
