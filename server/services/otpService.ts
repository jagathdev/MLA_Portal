import OTP from "../models/OTP.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendOTPEmail } from "./emailService.js";

/**
 * Sends and saves a new OTP for verification
 */
export async function createAndSendOTP(email: string): Promise<boolean> {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  try {
    // Delete existing OTPs for this email to prevent spam / clutter
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save the new OTP
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp: code,
      expiresAt,
      verified: false,
    });
    await otpDoc.save();

    // Send email
    const emailSent = await sendOTPEmail(email, code);
    return emailSent;
  } catch (error) {
    console.error(`Error creating OTP for ${email}:`, error);
    return false;
  }
}

/**
 * Verifies if an OTP is valid, unexpired, and correctly matches the email
 */
export async function verifyOTP(email: string, otpCode: string): Promise<boolean> {
  try {
    const formattedEmail = email.toLowerCase();
    
    // Find matching OTP document
    const otpRecord = await OTP.findOne({
      email: formattedEmail,
      otp: otpCode,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!otpRecord) {
      return false;
    }

    // Mark as verified or just delete to make it single-use
    await OTP.deleteOne({ _id: otpRecord._id });
    return true;
  } catch (error) {
    console.error(`Error verifying OTP for ${email}:`, error);
    return false;
  }
}
