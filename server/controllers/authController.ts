import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  dbSaveUser,
  dbFindUserByEmail,
  dbFindUserByMobile,
  dbFindUserByEmailOrMobile,
} from "../utils/storageHelper.js";
import { sendWelcomeEmail } from "../services/emailService.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_jwt_secret_123!!";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * @desc    Register a new citizen or admin
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array(),
    });
    return;
  }

  const { name, email, mobile, password, city, village, ward, role } = req.body;

  try {
    // Check if user already exists by email
    const existingEmailUser = await dbFindUserByEmail(email);
    if (existingEmailUser) {
      res.status(400).json({
        success: false,
        message: "A user with this email address is already registered.",
      });
      return;
    }

    // Check if user already exists by mobile
    const existingMobileUser = await dbFindUserByMobile(mobile);
    if (existingMobileUser) {
      res.status(400).json({
        success: false,
        message: "A user with this mobile number is already registered.",
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userEmail = email.toLowerCase().trim();
    const resolvedRole = userEmail === "shrmlaadmin@gmail.com" ? "admin" : "citizen";

    // Save user
    const newUser = await dbSaveUser({
      name,
      email: userEmail,
      mobile: mobile.trim(),
      password: hashedPassword,
      city: city || "Sholinghur",
      village: village || "",
      ward: ward || "",
      role: resolvedRole,
    });

    // Create JWT
    const token = jwt.sign(
      { id: String(newUser._id || newUser.id), role: newUser.role },
      String(JWT_SECRET),
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    // Send welcome email (asynchronous, do not block registration response)
    sendWelcomeEmail(newUser.email, newUser.name).catch(err => {
      console.error("Error sending welcome email:", err);
    });

    // Strip password from returned user object
    const userResponse = {
      id: newUser._id || newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      city: newUser.city,
      village: newUser.village,
      ward: newUser.ward,
      role: newUser.role,
    };

    res.status(201).json({
      success: true,
      message: "Registration successful. Welcome to Namma Ooru MLA!",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Login citizen or admin with email/mobile & password
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array(),
    });
    return;
  }

  const { identifier, email, password } = req.body;
  const loginId = identifier || email;

  if (!loginId) {
    res.status(400).json({
      success: false,
      message: "Email or mobile number is required.",
    });
    return;
  }

  try {
    // Find user by email or mobile
    const user = await dbFindUserByEmailOrMobile(loginId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email/mobile number or password.",
      });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email/mobile number or password.",
      });
      return;
    }

    // Create JWT
    const token = jwt.sign(
      { id: String(user._id || user.id), role: user.role },
      String(JWT_SECRET),
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    const userResponse = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      village: user.village,
      ward: user.ward,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Login successful. Welcome back!",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    next(error);
  }
}
