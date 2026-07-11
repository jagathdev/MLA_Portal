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
  const statusCode = err.statusCode || (err as any).status || 500;
  // If it's an OAuth TokenError, the status is usually 400 or 401
  const finalStatus = (err.name === 'TokenError' || err.message === 'Bad Request') ? 400 : statusCode;
  
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];
  
  // Extract OAuth specific details if present
  const oauthDetails = (err as any).oauthError ? (err as any).oauthError : undefined;

  console.error(`[Error Middleware] Status ${finalStatus}: ${message}`, err);

  res.status(finalStatus).json({
    success: false,
    message: message,
    errors: errors,
    errorName: err.name,
    oauthDetails: oauthDetails,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
