import type { NextFunction, Request, Response } from "express";
import multer from "multer";

export class ErrorHandler extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ message: "File Size is too large !" });
  }

  err.statusCode ||= 500;
  err.message ||= "Internal Server Error";

  // console.log(err); // only for debugging while development
  return res.status(err.statusCode).json({ message: err.message });
};
