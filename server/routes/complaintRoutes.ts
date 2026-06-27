import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  submitComplaint,
  getMyComplaints,
  getMyStats,
  getComplaintDetail,
  deleteOwnComplaint,
} from "../controllers/complaintController.js";

const router = Router();

// Submit complaint (Multipart file upload supported under 'image')
router.post("/", authMiddleware, upload.single("image"), submitComplaint);

// Retrieve my complaints list
router.get("/my", authMiddleware, getMyComplaints);

// Retrieve my complaints statistics
router.get("/my/stats", authMiddleware, getMyStats);

// Retrieve specific complaint details
router.get("/:id", authMiddleware, getComplaintDetail);

// Delete specific owned complaint
router.delete("/:id", authMiddleware, deleteOwnComplaint);

export default router;
