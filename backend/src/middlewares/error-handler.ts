import type { Request, Response, NextFunction } from "express";

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
  err.statusCode ||= 500;
  err.message ||= "Internal Server Error";

  // console.log(err); // only for debugging while development
  return res.status(err.statusCode).json({ message: err.message });
};
