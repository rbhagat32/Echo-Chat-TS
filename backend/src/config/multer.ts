import multer, { type Options } from "multer";

export const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 },
} as Options);
