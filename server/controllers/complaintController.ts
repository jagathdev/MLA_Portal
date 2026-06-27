import { Request, Response, NextFunction } from "express";
import {
  dbSaveComplaint,
  dbGetComplaintsOfUser,
  dbGetComplaintById,
  dbDeleteComplaint,
  dbGetComplaintStats,
  dbFindUserById,
} from "../utils/storageHelper.js";
import { generateComplaintId } from "../utils/generateComplaintId.js";
import { sendComplaintConfirmationEmail } from "../services/emailService.js";

/**
 * @desc    Submit a new citizen complaint
 * @route   POST /api/complaints
 * @access  Private (Citizen)
 */
export async function submitComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const {
      fullName,
      fullNameInput,
      mobileNumber,
      mobileInput,
      email,
      emailInput,
      category,
      subject,
      description,
      villageArea,
      wardNumber,
      priority,
    } = req.body;

    // Use values supplied or fetch them from the user profile
    const user = await dbFindUserById(req.user.id);
    const resolvedName = fullName || fullNameInput || (user ? user.name : "Citizen");
    const resolvedMobile = mobileNumber || mobileInput || (user ? user.mobile : "");
    const resolvedEmail = email || emailInput || (user ? user.email : "");

    if (!category || !subject || !description || !villageArea) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: category, subject, description, and villageArea are mandatory.",
      });
      return;
    }

    // Auto generate ID
    const complaintId = await generateComplaintId();

    // Prepare dates
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const timeFormatted = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    // Handle uploaded file
    const imageEvidence: string[] = [];
    if (req.file) {
      // Save local path web-accessible route
      imageEvidence.push(`/uploads/${req.file.filename}`);
    } else if (req.body.imageEvidence) {
      // Support manual arrays sent
      if (Array.isArray(req.body.imageEvidence)) {
        imageEvidence.push(...req.body.imageEvidence);
      } else if (typeof req.body.imageEvidence === "string") {
        imageEvidence.push(req.body.imageEvidence);
      }
    }

    // Construct complaint payload
    const complaintPayload = {
      complaintId,
      userId: req.user.id,
      fullName: resolvedName,
      mobileNumber: resolvedMobile,
      email: resolvedEmail,
      category,
      subject,
      description,
      villageArea,
      wardNumber: wardNumber || "",
      priority: priority || "Medium",
      status: "Submitted",
      dateSubmitted: dateFormatted,
      lastUpdated: dateFormatted,
      adminRemarks: "",
      imageEvidence,
      timeline: [
        {
          id: "step_init",
          status: "Submitted",
          date: dateFormatted,
          time: timeFormatted,
          remark: "Complaint filed successfully and assigned ID " + complaintId,
        },
      ],
    };

    const newComplaint = await dbSaveComplaint(complaintPayload);

    // Send email confirmation asynchronously
    if (resolvedEmail) {
      sendComplaintConfirmationEmail(
        resolvedEmail,
        resolvedName,
        complaintId,
        category,
        subject
      ).catch(err => {
        console.error("Error sending complaint confirmation email:", err);
      });
    }

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully. Your reference ID is " + complaintId,
      data: newComplaint,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get all complaints belonging to the logged-in user
 * @route   GET /api/complaints/my
 * @access  Private (Citizen)
 */
export async function getMyComplaints(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const list = await dbGetComplaintsOfUser(req.user.id);

    res.status(200).json({
      success: true,
      message: "User complaints retrieved successfully.",
      data: list,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get user's complaint count/stats by status
 * @route   GET /api/complaints/my/stats
 * @access  Private (Citizen)
 */
export async function getMyStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const stats = await dbGetComplaintStats(req.user.id);

    res.status(200).json({
      success: true,
      message: "User complaint statistics calculated successfully.",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get details of a single complaint
 * @route   GET /api/complaints/:id
 * @access  Private (Citizen or Admin)
 */
export async function getComplaintDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const complaint = await dbGetComplaintById(req.params.id);

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
      return;
    }

    // Verify ownership if the requester is a citizen
    if (req.user.role === "citizen" && String(complaint.userId) !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this complaint.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Complaint retrieved successfully.",
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete user's own complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private (Citizen)
 */
export async function deleteOwnComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    // Verify first
    const complaint = await dbGetComplaintById(req.params.id);
    if (!complaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
      return;
    }

    if (String(complaint.userId) !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own complaints.",
      });
      return;
    }

    // Perform deletion
    const deleted = await dbDeleteComplaint(req.params.id, req.user.id);
    if (deleted) {
      res.status(200).json({
        success: true,
        message: "Complaint deleted successfully.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Could not complete complaint deletion.",
      });
    }
  } catch (error) {
    next(error);
  }
}
