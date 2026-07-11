import { Router, Request, Response } from "express";
import { body } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/authController.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_jwt_secret_123!!";
const CLIENT_URL = process.env.CLIENT_URL || "https://mla-portal-dusky.vercel.app";

// ================================================================
// NORMAL REGISTER - Email + Password
// ================================================================

router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim(),

    body("email")
      .isEmail()
      .withMessage("Provide a valid email address")
      .normalizeEmail(),

    body("mobile")
      .notEmpty()
      .withMessage("Mobile number is required")
      .trim(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  register
);

// ================================================================
// NORMAL LOGIN - Email/Mobile + Password
// ================================================================

router.post(
  "/login",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Email or mobile number is required")
      .trim(),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  login
);

// ================================================================
// GOOGLE OAUTH - Step 1: Redirect to Google
// ================================================================

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// ================================================================
// GOOGLE OAUTH - Step 2: Google Callback
// ================================================================

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=google_auth_failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;

    if (!user) {
      return res.redirect(`${CLIENT_URL}/login?error=no_user_found`);
    }

    // Create JWT - same format as normal login
    const token = jwt.sign(
      {
        id: String(user._id || user.id),
        role: user.role,
      },
      String(JWT_SECRET),
      { expiresIn: "7d" }
    );

    const userName = encodeURIComponent(user.name || "");
    const userMobile = encodeURIComponent(!user.mobile.startsWith("GOOGLE_AUTH") ? user.mobile : user.email);

    // Redirect frontend with token + role info
    res.redirect(
      `${CLIENT_URL}/oauth-callback?token=${token}&role=${user.role}&name=${userName}&mobile=${userMobile}`
    );
  }
);

// ================================================================
// GOOGLE OAUTH - Token verify (optional - frontend can call this)
// ================================================================

router.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, String(JWT_SECRET)) as {
      id: string;
      role: string;
    };

    res.status(200).json({
      success: true,
      message: "Token is valid.",
      data: decoded,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
});

export default router;