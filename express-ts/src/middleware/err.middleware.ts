import { Request, Response, NextFunction } from "express";

export class ErrMiddleware {
  static handleError(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
      status: "error",
      statusCode: status,
      message: message,
    });
  }
}