import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User.js";
import Complaint, { IComplaint } from "../models/Complaint.js";
import OTP, { IOTP } from "../models/OTP.js";

const LOCAL_DB_PATH = path.join(process.cwd(), "uploads", "local_db.json");

interface LocalStorage {
  users: any[];
  complaints: any[];
  otps: any[];
}

// Ensure the local file exists with initial empty arrays
function loadLocalData(): LocalStorage {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial: LocalStorage = { users: [], complaints: [], otps: [] };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2));
      seedDefaultUsersSync(initial);
      return initial;
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    const parsed = JSON.parse(data);
    if (!parsed.users || parsed.users.length === 0) {
      seedDefaultUsersSync(parsed);
    }
    return parsed;
  } catch (err) {
    return { users: [], complaints: [], otps: [] };
  }
}

function saveLocalData(data: LocalStorage) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to local JSON DB:", err);
  }
}

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// ================= USER STORAGE ACTIONS =================

export async function dbSaveUser(userData: any): Promise<any> {
  if (isDbConnected()) {
    const user = new User(userData);
    return await user.save();
  } else {
    const local = loadLocalData();
    const id = "user_" + Date.now() + "_" + Math.round(Math.random() * 1000);
    const now = new Date().toISOString();
    const newUser = {
      _id: id,
      id: id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };
    local.users.push(newUser);
    saveLocalData(local);
    return newUser;
  }
}

export async function dbFindUserByEmail(email: string): Promise<any> {
  if (isDbConnected()) {
    return await User.findOne({ email: email.toLowerCase().trim() });
  } else {
    const local = loadLocalData();
    return local.users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim()) || null;
  }
}

export async function dbFindUserByMobile(mobile: string): Promise<any> {
  const queryVal = mobile.trim();
  if (isDbConnected()) {
    return await User.findOne({ mobile: queryVal });
  } else {
    const local = loadLocalData();
    return local.users.find(u => u.mobile.trim() === queryVal) || null;
  }
}

export async function dbFindUserByEmailOrMobile(identifier: string): Promise<any> {
  const queryVal = identifier.toLowerCase().trim();
  const rawMobile = identifier.trim();
  if (isDbConnected()) {
    return await User.findOne({
      $or: [
        { email: queryVal },
        { mobile: rawMobile }
      ]
    });
  } else {
    const local = loadLocalData();
    return local.users.find(u =>
      u.email.toLowerCase().trim() === queryVal ||
      u.mobile.trim() === rawMobile
    ) || null;
  }
}

export async function seedDefaultUsersMongo(): Promise<void> {
  try {
    const adminExists = await User.findOne({ email: "shrmlaadmin@gmail.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("shrMLA@1234", salt);
      const defaultAdmin = new User({
        name: "MLA Admin",
        email: "shrmlaadmin@gmail.com",
        mobile: "8888888888",
        password: hashedPassword,
        city: "Sholinghur",
        village: "Central Office",
        ward: "Ward 01",
        role: "admin",
      });
      await defaultAdmin.save();
      console.log("✅ Seeded default admin in MongoDB");
    }

    const citizenExists = await User.findOne({ mobile: "9999999999" });
    if (!citizenExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("citizen", salt);
      const defaultCitizen = new User({
        name: "Karthikeyan R",
        email: "citizen@nammaoorumla.in",
        mobile: "9999999999",
        password: hashedPassword,
        city: "Sholinghur",
        village: "Periyapet",
        ward: "Ward 04",
        role: "citizen",
      });
      await defaultCitizen.save();
      console.log("✅ Seeded default citizen in MongoDB");
    }
  } catch (err) {
    console.error("❌ Error seeding default users in MongoDB:", err);
  }
}

export function seedDefaultUsersSync(local: LocalStorage): void {
  try {
    const adminExists = local.users.some(u => u.email === "shrmlaadmin@gmail.com");
    if (!adminExists) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync("shrMLA@1234", salt);
      const defaultAdmin = {
        _id: "user_admin_default",
        id: "user_admin_default",
        name: "MLA Admin",
        email: "shrmlaadmin@gmail.com",
        mobile: "8888888888",
        password: hashedPassword,
        city: "Sholinghur",
        village: "Central Office",
        ward: "Ward 01",
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      local.users.push(defaultAdmin);
      saveLocalData(local);
      console.log("✅ Seeded default admin in local JSON DB");
    }

    const citizenExists = local.users.some(u => u.mobile === "9999999999");
    if (!citizenExists) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync("citizen", salt);
      const defaultCitizen = {
        _id: "user_citizen_default",
        id: "user_citizen_default",
        name: "Karthikeyan R",
        email: "citizen@nammaoorumla.in",
        mobile: "9999999999",
        password: hashedPassword,
        city: "Sholinghur",
        village: "Periyapet",
        ward: "Ward 04",
        role: "citizen",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      local.users.push(defaultCitizen);
      saveLocalData(local);
      console.log("✅ Seeded default citizen in local JSON DB");
    }
  } catch (err) {
    console.error("❌ Error seeding default users in local JSON DB:", err);
  }
}

export async function dbFindUserById(id: string): Promise<any> {
  if (isDbConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findById(id);
  } else {
    const local = loadLocalData();
    return local.users.find(u => u._id === id || u.id === id) || null;
  }
}

export async function dbUpdateUser(id: string, updateData: any): Promise<any> {
  if (isDbConnected()) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  } else {
    const local = loadLocalData();
    const index = local.users.findIndex(u => u._id === id || u.id === id);
    if (index === -1) return null;
    local.users[index] = {
      ...local.users[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    saveLocalData(local);
    return local.users[index];
  }
}

export async function dbGetAllUsers(): Promise<any[]> {
  if (isDbConnected()) {
    return await User.find({}, "-password").sort({ createdAt: -1 });
  } else {
    const local = loadLocalData();
    return local.users.map(({ password, ...u }) => u);
  }
}

// ================= COMPLAINT STORAGE ACTIONS =================

export async function dbSaveComplaint(complaintData: any): Promise<any> {
  if (isDbConnected()) {
    const complaint = new Complaint(complaintData);
    return await complaint.save();
  } else {
    const local = loadLocalData();
    const id = "comp_" + Date.now() + "_" + Math.round(Math.random() * 1000);
    const now = new Date().toISOString();
    const newComplaint = {
      _id: id,
      id: id,
      ...complaintData,
      createdAt: now,
      updatedAt: now,
    };
    local.complaints.push(newComplaint);
    saveLocalData(local);
    return newComplaint;
  }
}

export async function dbGetComplaintsOfUser(userId: string): Promise<any[]> {
  if (isDbConnected()) {
    return await Complaint.find({ userId }).sort({ createdAt: -1 });
  } else {
    const local = loadLocalData();
    return local.complaints.filter(c => c.userId === userId).reverse();
  }
}

export async function dbGetComplaintById(id: string): Promise<any> {
  if (isDbConnected()) {
    // Check both mongo ObjectId and string id/complaintId
    if (mongoose.Types.ObjectId.isValid(id)) {
      const byId = await Complaint.findById(id);
      if (byId) return byId;
    }
    return await Complaint.findOne({ complaintId: id });
  } else {
    const local = loadLocalData();
    return local.complaints.find(c => c._id === id || c.id === id || c.complaintId === id) || null;
  }
}

export async function dbDeleteComplaint(id: string, userId?: string): Promise<boolean> {
  if (isDbConnected()) {
    const query: any = { _id: id };
    if (userId) query.userId = userId;
    const result = await Complaint.deleteOne(query);
    return result.deletedCount > 0;
  } else {
    const local = loadLocalData();
    const beforeCount = local.complaints.length;
    local.complaints = local.complaints.filter(c => {
      if (userId && c.userId !== userId) return true;
      return c._id !== id && c.id !== id && c.complaintId !== id;
    });
    saveLocalData(local);
    return local.complaints.length < beforeCount;
  }
}

export async function dbGetComplaintStats(userId: string): Promise<any> {
  let complaints: any[] = [];
  if (isDbConnected()) {
    complaints = await Complaint.find({ userId });
  } else {
    const local = loadLocalData();
    complaints = local.complaints.filter(c => c.userId === userId);
  }

  const stats = {
    total: complaints.length,
    submitted: 0,
    underReview: 0,
    approved: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    rejected: 0,
  };

  complaints.forEach(c => {
    const status = (c.status || "").toLowerCase();
    if (status === "submitted") stats.submitted++;
    else if (status === "under review") stats.underReview++;
    else if (status === "approved") stats.approved++;
    else if (status === "in progress") stats.inProgress++;
    else if (status === "resolved") stats.resolved++;
    else if (status === "closed") stats.closed++;
    else if (status === "rejected") stats.rejected++;
  });

  return stats;
}

export async function dbGetAdminComplaintStats(): Promise<any> {
  let usersCount = 0;
  let complaints: any[] = [];

  if (isDbConnected()) {
    usersCount = await User.countDocuments({ role: "citizen" });
    complaints = await Complaint.find({});
  } else {
    const local = loadLocalData();
    usersCount = local.users.filter(u => u.role === "citizen").length;
    complaints = local.complaints;
  }

  const stats = {
    totalUsers: usersCount,
    totalComplaints: complaints.length,
    submitted: 0,
    underReview: 0,
    approved: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    rejected: 0,
  };

  complaints.forEach(c => {
    const status = (c.status || "").toLowerCase();
    if (status === "submitted") stats.submitted++;
    else if (status === "under review") stats.underReview++;
    else if (status === "approved") stats.approved++;
    else if (status === "in progress") stats.inProgress++;
    else if (status === "resolved") stats.resolved++;
    else if (status === "closed") stats.closed++;
    else if (status === "rejected") stats.rejected++;
  });

  return stats;
}

export async function dbGetAdminComplaints(filters: {
  search?: string;
  status?: string;
  category?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<{ complaints: any[]; total: number }> {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  if (isDbConnected()) {
    const query: any = {};

    if (filters.search) {
      query.$or = [
        { fullName: new RegExp(filters.search, "i") },
        { mobileNumber: new RegExp(filters.search, "i") },
        { complaintId: new RegExp(filters.search, "i") },
      ];
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.from || filters.to) {
      // Parse dates from string dates inside documents (dateSubmitted is string e.g. '2026-06-27')
      // For mongoose, it might be simpler to search via timestamps
      query.createdAt = {};
      if (filters.from) {
        query.createdAt.$gte = new Date(filters.from);
      }
      if (filters.to) {
        query.createdAt.$lte = new Date(filters.to);
      }
    }

    const total = await Complaint.countDocuments(query);
    const list = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return { complaints: list, total };
  } else {
    const local = loadLocalData();
    let list = [...local.complaints];

    // Filter by search
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        c =>
          (c.fullName || "").toLowerCase().includes(s) ||
          (c.mobileNumber || "").toLowerCase().includes(s) ||
          (c.complaintId || "").toLowerCase().includes(s)
      );
    }

    // Filter by status
    if (filters.status) {
      list = list.filter(c => c.status === filters.status);
    }

    // Filter by category
    if (filters.category) {
      list = list.filter(c => c.category === filters.category);
    }

    // Filter by date
    if (filters.from || filters.to) {
      list = list.filter(c => {
        const dateStr = c.dateSubmitted || c.createdAt;
        if (!dateStr) return true;
        const ts = new Date(dateStr).getTime();
        if (filters.from && ts < new Date(filters.from).getTime()) return false;
        if (filters.to && ts > new Date(filters.to).getTime()) return false;
        return true;
      });
    }

    // Sort by newest
    list.reverse();

    const total = list.length;
    const paginated = list.slice(skip, skip + limit);

    return { complaints: paginated, total };
  }
}

export async function dbUpdateComplaintStatus(
  id: string,
  newStatus: string,
  adminRemarks: string
): Promise<any> {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
  const timeFormatted = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const timelineStep = {
    id: "step_" + Date.now(),
    status: newStatus,
    date: dateFormatted,
    time: timeFormatted,
    remark: adminRemarks || `Complaint status updated to ${newStatus}`,
  };

  if (isDbConnected()) {
    const updateQuery: any = {
      $set: {
        status: newStatus,
        adminRemarks: adminRemarks,
        lastUpdated: dateFormatted,
      },
      $push: {
        timeline: timelineStep,
      },
    };

    if (newStatus === "Resolved") {
      updateQuery.$set.resolvedAt = now;
    } else if (newStatus === "Closed") {
      updateQuery.$set.closedAt = now;
    }

    // Find and update by either MongoDB _id or custom complaintId
    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.complaintId = id;
    }

    return await Complaint.findOneAndUpdate(query, updateQuery, { new: true });
  } else {
    const local = loadLocalData();
    const index = local.complaints.findIndex(c => c._id === id || c.id === id || c.complaintId === id);
    if (index === -1) return null;

    const oldComplaint = local.complaints[index];
    const updated = {
      ...oldComplaint,
      status: newStatus,
      adminRemarks: adminRemarks,
      lastUpdated: dateFormatted,
      timeline: [...(oldComplaint.timeline || []), timelineStep],
      updatedAt: now.toISOString(),
    };

    if (newStatus === "Resolved") {
      updated.resolvedAt = now.toISOString();
    } else if (newStatus === "Closed") {
      updated.closedAt = now.toISOString();
    }

    local.complaints[index] = updated;
    saveLocalData(local);
    return updated;
  }
}

// ================= OTP STORAGE ACTIONS =================

export async function dbSaveOTP(email: string, otp: string, expiresAt: Date): Promise<any> {
  if (isDbConnected()) {
    await OTP.deleteMany({ email: email.toLowerCase().trim() });
    const otpDoc = new OTP({ email: email.toLowerCase().trim(), otp, expiresAt });
    return await otpDoc.save();
  } else {
    const local = loadLocalData();
    // Clear old OTPs
    local.otps = local.otps.filter(o => o.email.toLowerCase().trim() !== email.toLowerCase().trim());
    const newOtp = {
      _id: "otp_" + Date.now(),
      email: email.toLowerCase().trim(),
      otp,
      expiresAt: expiresAt.toISOString(),
      verified: false,
    };
    local.otps.push(newOtp);
    saveLocalData(local);
    return newOtp;
  }
}

export async function dbVerifyOTP(email: string, otp: string): Promise<boolean> {
  if (isDbConnected()) {
    const record = await OTP.findOne({
      email: email.toLowerCase().trim(),
      otp: otp,
      expiresAt: { $gt: new Date() },
    });
    if (record) {
      await OTP.deleteOne({ _id: record._id });
      return true;
    }
    return false;
  } else {
    const local = loadLocalData();
    const index = local.otps.findIndex(
      o =>
        o.email.toLowerCase().trim() === email.toLowerCase().trim() &&
        o.otp === otp &&
        new Date(o.expiresAt).getTime() > Date.now()
    );
    if (index !== -1) {
      local.otps.splice(index, 1);
      saveLocalData(local);
      return true;
    }
    return false;
  }
}
