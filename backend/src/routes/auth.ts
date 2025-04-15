import express from "express";
import { checkLoggedIn, login, logout, signUp } from "../controllers/auth.js";
import { isLoggedIn } from "../middlewares/auth.js";
import { multerUpload } from "../config/multer.js";

const router = express.Router();

router.get("/check", checkLoggedIn);
router.post("/signup", multerUpload.single("avatar"), signUp);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);

export default router;
