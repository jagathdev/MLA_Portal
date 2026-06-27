import Complaint from "../models/Complaint.js";

export async function generateComplaintId(): Promise<string> {
  const year = new Date().getFullYear();
  
  try {
    // Count existing documents for the year to get a sequential number
    const count = await Complaint.countDocuments({
      complaintId: new RegExp(`^NOM-${year}-`)
    });
    
    const sequentialNum = String(count + 1).padStart(4, "0");
    return `NOM-${year}-${sequentialNum}`;
  } catch (error) {
    // Fallback to random 4 digit sequence if db fails
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `NOM-${year}-${randomNum}`;
  }
}
