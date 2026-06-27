import { getMailTransporter } from "../config/mailConfig.js";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<boolean> {
  const transporter = getMailTransporter();
  
  if (!transporter) {
    console.log("\n=================== MOCK EMAIL LOG ===================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (HTML):\n${html}`);
    console.log("======================================================\n");
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Namma Ooru MLA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${(error as Error).message}`);
    return false;
  }
}

/**
 * Sends a welcome email to a newly registered user.
 */
export async function sendWelcomeEmail(toEmail: string, userName: string) {
  const subject = "Welcome to Namma Ooru MLA Portal!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Vanakkam, ${userName}!</h2>
      <p style="font-size: 16px; color: #334155;">Thank you for registering on <strong>Namma Ooru MLA</strong>—the public grievance portal for Sholinghur constituency under <strong>Dr. Kapil MLA</strong>.</p>
      <p style="font-size: 14px; color: #475569;">You can now submit civic complaints, track resolutions in real-time, and contribute to making our constituency a better place.</p>
      <div style="margin: 20px 0; padding: 15px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: bold;">Quick Instructions:</p>
        <ul style="margin: 5px 0 0 20px; padding: 0; font-size: 14px; color: #1e3a8a;">
          <li>Go to the dashboard to file a complaint</li>
          <li>Upload clean image evidence if available</li>
          <li>Track status changes from 'Submitted' to 'Resolved'</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #475569;">Together, let's build a stronger Sholinghur!</p>
      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated system email. Please do not reply directly.</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
}

/**
 * Sends a confirmation email after filing a complaint.
 */
export async function sendComplaintConfirmationEmail(
  toEmail: string,
  userName: string,
  complaintId: string,
  category: string,
  complaintSubject: string
) {
  const subject = `Complaint Submitted Successfully - [${complaintId}]`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Grievance Logged successfully</h2>
      <p style="font-size: 16px; color: #334155;">Hello ${userName},</p>
      <p style="font-size: 14px; color: #475569;">Your grievance has been successfully submitted and logged in our system. MLA Dr. Kapil's team will inspect this shortly.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="background-color: #f1f5f9;">
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Complaint ID</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; color: #10b981;">${complaintId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Category</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${category}</td>
        </tr>
        <tr style="background-color: #f1f5f9;">
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Subject</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${complaintSubject}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Current Status</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;"><span style="background-color: #eff6ff; color: #2563eb; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">Submitted</span></td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #475569;">You will receive automated email alerts as the status of your complaint changes.</p>
      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">Namma Ooru MLA - Office of Sholinghur MLA Dr. Kapil</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
}

/**
 * Sends OTP validation email.
 */
export async function sendOTPEmail(toEmail: string, otp: string) {
  const subject = `${otp} is your Namma Ooru MLA Verification Code`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; text-align: center;">
      <h2 style="color: #0f172a; margin-bottom: 20px;">Verification Code</h2>
      <p style="font-size: 15px; color: #475569; margin-bottom: 30px;">Please use the following 6-digit One-Time Password (OTP) to complete your login/verification. This code is valid for 10 minutes.</p>
      <div style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background-color: #f0fdf4; border: 2px dashed #10b981; padding: 15px 30px; border-radius: 8px; margin-bottom: 30px;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">If you did not request this OTP, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
}

/**
 * Sends updated status notification.
 */
export async function sendStatusUpdateEmail(
  toEmail: string,
  userName: string,
  complaintId: string,
  subjectText: string,
  oldStatus: string,
  newStatus: string,
  adminRemarks: string
) {
  const subject = `[Update] Complaint ${complaintId} Status: ${newStatus}`;
  
  // Highlight color based on status
  let badgeColor = "#2563eb"; // Blue
  let bgBadgeColor = "#eff6ff";
  if (newStatus === "Resolved") {
    badgeColor = "#16a34a"; // Green
    bgBadgeColor = "#f0fdf4";
  } else if (newStatus === "Rejected") {
    badgeColor = "#dc2626"; // Red
    bgBadgeColor = "#fef2f2";
  } else if (newStatus === "In Progress") {
    badgeColor = "#ca8a04"; // Yellow
    bgBadgeColor = "#fef9c3";
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Status Update Alert</h2>
      <p style="font-size: 16px; color: #334155;">Hello ${userName},</p>
      <p style="font-size: 14px; color: #475569;">The status of your complaint <strong>${complaintId}</strong> has been updated by the MLA administration team.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="background-color: #f1f5f9;">
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; width: 35%;">Complaint ID</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${complaintId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Subject</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${subjectText}</td>
        </tr>
        <tr style="background-color: #f1f5f9;">
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">New Status</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">
            <span style="background-color: ${bgBadgeColor}; color: ${badgeColor}; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">${newStatus}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold; vertical-align: top;">Admin Remarks</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0; color: #1e293b; font-style: italic;">
            ${adminRemarks || "No remarks provided yet."}
          </td>
        </tr>
        <tr style="background-color: #f1f5f9;">
          <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Last Updated</td>
          <td style="padding: 10px; border: 1px solid #e2e8f0;">${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #475569;">Log in to the portal to view complete timelines and upload additional details.</p>
      <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">Namma Ooru MLA - Office of Sholinghur MLA Dr. Kapil</p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html });
}
