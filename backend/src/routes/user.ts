import express from "express";
import { multerUpload } from "../config/multer.js";
import {
  deleteAvatar,
  deleteBio,
  getRequests,
  getUser,
  respondRequest,
  searchUser,
  sendRequest,
  updateDetails,
} from "../controllers/user.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = express.Router();

router.use(isLoggedIn);
router.get("/get-user", getUser);
router.get("/search-user", searchUser);
router.post("/send-request/:id", sendRequest);
router.get("/get-requests", getRequests);
router.post("/respond-request/:id", respondRequest);
router.put("/update-details", multerUpload.single("avatar"), updateDetails);
router.delete("/delete-bio", deleteBio);
router.delete("/delete-avatar", deleteAvatar);

export default router;
