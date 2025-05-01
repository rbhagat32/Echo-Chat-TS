import type { Request, Response, NextFunction } from "express";

type ControllerTypes = (req: Request, res: Response) => Promise<any> | any;

export const tryCatch = (controller: ControllerTypes) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      return next(error);
    }
  };
};
