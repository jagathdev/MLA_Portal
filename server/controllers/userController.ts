import { Request, Response, NextFunction } from "express";
import { dbFindUserById, dbUpdateUser } from "../utils/storageHelper.js";

/**
 * @desc    Get logged-in user profile
 * @route   GET /api/user/profile
 * @access  Private (Citizen or Admin)
 */
export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    const user = await dbFindUserById(req.user.id);
    if (!user) {
      res.status(444).json({ success: false, message: "User profile not found." });
      return;
    }

    const userProfile = {
      id: user._id || user.id,
      fullName: user.name,
      mobileNumber: user.mobile,
      email: user.email,
      cityTown: user.city || "",
      villageArea: user.village || "",
      wardNumber: user.ward || "",
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Update logged-in user profile
 * @route   PUT /api/user/profile
 * @access  Private (Citizen or Admin)
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Authentication required." });
      return;
    }

    // Support both frontend camelCase and backend names
    const {
      name,
      fullName,
      mobile,
      mobileNumber,
      city,
      cityTown,
      village,
      villageArea,
      ward,
      wardNumber,
    } = req.body;

    const updatedFields: any = {};
    
    if (name !== undefined) updatedFields.name = name;
    if (fullName !== undefined) updatedFields.name = fullName;
    
    if (mobile !== undefined) updatedFields.mobile = mobile;
    if (mobileNumber !== undefined) updatedFields.mobile = mobileNumber;
    
    if (city !== undefined) updatedFields.city = city;
    if (cityTown !== undefined) updatedFields.city = cityTown;
    
    if (village !== undefined) updatedFields.village = village;
    if (villageArea !== undefined) updatedFields.village = villageArea;
    
    if (ward !== undefined) updatedFields.ward = ward;
    if (wardNumber !== undefined) updatedFields.ward = wardNumber;

    const updatedUser = await dbUpdateUser(req.user.id, updatedFields);
    
    if (!updatedUser) {
      res.status(444).json({ success: false, message: "User profile not found." });
      return;
    }

    const userProfile = {
      id: updatedUser._id || updatedUser.id,
      fullName: updatedUser.name,
      mobileNumber: updatedUser.mobile,
      email: updatedUser.email,
      cityTown: updatedUser.city || "",
      villageArea: updatedUser.village || "",
      wardNumber: updatedUser.ward || "",
      role: updatedUser.role,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
}
