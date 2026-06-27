import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  getAdminDashboard,
  getAdminComplaints,
  updateStatus,
  deleteComplaint,
  getUsersList,
} from "../controllers/adminController.js";

const router = Router();

// Apply auth and admin check universally to this router
router.use(authMiddleware);
router.use(adminMiddleware);

// Get global administrative dashboard metrics
router.get("/dashboard", getAdminDashboard);

// Get all complaints with searching, filtering, and pagination
router.get("/complaints", getAdminComplaints);

// Update status of any complaint
router.patch("/complaints/:id/status", updateStatus);

// Delete any complaint from the database
router.delete("/complaints/:id", deleteComplaint);

// List all registered users
router.get("/users", getUsersList);

export default router;
