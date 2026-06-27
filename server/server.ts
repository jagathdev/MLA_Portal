import "./config/envConfig"; // Load Environment Variables first
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passport from "passport";
import "./config/passportConfig.js"; // Initialize passport strategies

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Connect to Database if URI is present
  await connectDB();

  // Basic Middlewares
  app.use(cors({
    origin: true, // Allow any origin in dev (Vite client runs on port 5173 by default)
    credentials: true,
  }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use(passport.initialize());

  // Expose local file uploads statically
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // API Routes (Mounted first)
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/complaints", complaintRoutes);
  app.use("/api/admin", adminRoutes);

  // Health check API
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Namma Ooru MLA API is online.",
      timestamp: new Date(),
    });
  });

  // Standalone API server central error handler
  app.use(errorMiddleware);

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`======================================================`);
    console.log(`🟢 Standalone Namma Ooru MLA API Server running!`);
    console.log(`🟢 API Endpoint: http://localhost:${PORT}`);
    console.log(`======================================================`);
  });
}

startServer().catch(err => {
  console.error("Critical error starting Standalone API server:", err);
});
