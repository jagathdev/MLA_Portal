import { Request, Response, NextFunction } from "express";
import {
  dbGetAdminComplaintStats,
  dbGetAdminComplaints,
  dbUpdateComplaintStatus,
  dbDeleteComplaint,
  dbGetAllUsers,
  dbGetComplaintById,
} from "../utils/storageHelper.js";
import { sendStatusUpdateEmail } from "../services/emailService.js";

/**
 * @desc    Get administrator dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin Only)
 */
export async function getAdminDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await dbGetAdminComplaintStats();

    res.status(200).json({
      success: true,
      message: "Admin dashboard metrics calculated.",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get all system complaints with search, filter, pagination
 * @route   GET /api/admin/complaints
 * @access  Private (Admin Only)
 */
export async function getAdminComplaints(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = req.query.search ? String(req.query.search) : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const from = req.query.from ? String(req.query.from) : undefined;
    const to = req.query.to ? String(req.query.to) : undefined;
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;

    const filters = { search, status, category, from, to, page, limit };
    const { complaints, total } = await dbGetAdminComplaints(filters);

    res.status(200).json({
      success: true,
      message: "Admin complaints list retrieved successfully.",
      data: {
        complaints,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update any complaint's status and remarks
 * @route   PATCH /api/admin/complaints/:id/status
 * @access  Private (Admin Only)
 */
export async function updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: "Status field is required to update complaint status.",
      });
      return;
    }

    // Get original complaint first to read user info and old status
    const originalComplaint = await dbGetComplaintById(id);
    if (!originalComplaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
      return;
    }

    const oldStatus = originalComplaint.status;

    // Update status
    const updatedComplaint = await dbUpdateComplaintStatus(id, status, adminRemarks);

    if (!updatedComplaint) {
      res.status(500).json({
        success: false,
        message: "Could not complete complaint status update.",
      });
      return;
    }

    // Send email alert to citizen
    if (updatedComplaint.email) {
      sendStatusUpdateEmail(
        updatedComplaint.email,
        updatedComplaint.fullName,
        updatedComplaint.complaintId,
        updatedComplaint.subject,
        oldStatus,
        status,
        adminRemarks || ""
      ).catch(err => {
        console.error("Error sending status update email:", err);
      });
    }

    res.status(200).json({
      success: true,
      message: `Complaint ${updatedComplaint.complaintId} updated to '${status}' status.`,
      data: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Delete any complaint in system
 * @route   DELETE /api/admin/complaints/:id
 * @access  Private (Admin Only)
 */
export async function deleteComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const exists = await dbGetComplaintById(id);
    if (!exists) {
      res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
      return;
    }

    const deleted = await dbDeleteComplaint(id);

    if (deleted) {
      res.status(200).json({
        success: true,
        message: `Complaint ${exists.complaintId || id} successfully deleted from system.`,
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

/**
 * @desc    Get all registered users list
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
export async function getUsersList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await dbGetAllUsers();

    res.status(200).json({
      success: true,
      message: "Users collection retrieved successfully.",
      data: list,
    });
  } catch (error) {
    next(error);
  }
}
