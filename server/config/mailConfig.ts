import nodemailer from "nodemailer";

export function getMailTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("⚠️ Nodemailer credentials (EMAIL_USER / EMAIL_PASS) are missing. Emails will be logged to console instead of sent.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}
