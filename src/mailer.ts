import nodemailer from "nodemailer";
import "dotenv/config";

export const sendConfirmationEmail = async (
  to: string,
  ticketId: number,
  issue: string,
  price: number
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,              // <--- CHANGE to 587
      secure: false,          // <--- MUST be false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: "SSLv3",     // Helps with compatibility
        rejectUnauthorized: false, // Helps bypass strict SSL checks
      },
      connectionTimeout: 10000, 
    } as any);

    console.log(`Attempting to send email to ${to}...`);

    await transporter.sendMail({
      from: `"IT Help Desk" <${process.env.EMAIL_USER}>`,
      to,
      subject: "IT Support Ticket Confirmation",
      text: `Ticket ID: ${ticketId}\nIssue: ${issue}\nFee: $${price}`,
    });

    return true;

  } catch (error) {
    console.error("EMAIL FAILED:", error);
    return false;
  }
};
