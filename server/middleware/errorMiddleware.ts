import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any[];
}

export function errorMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  console.error(`[Error Middleware] Status ${statusCode}: ${message}`, err);

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,
  });
}
