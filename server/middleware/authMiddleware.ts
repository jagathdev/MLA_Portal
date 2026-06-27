import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: "citizen" | "admin";
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: Express.User;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(412).json({
      success: false,
      message: "Authorization token missing or invalid. Use format 'Bearer <token>'."
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "default_fallback_jwt_secret_123!!";

  try {
    const decoded = jwt.verify(token, secret) as { id: string; role: "citizen" | "admin" };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired authorization token."
    });
  }
}
