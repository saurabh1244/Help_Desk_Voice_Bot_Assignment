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
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // --- CRITICAL FIXES ---
      family: 4,              // Force IPv4 (Fixes ENETUNREACH error)
      connectionTimeout: 10000, // 10s timeout (Fixes hanging)
      // ----------------------
    } as any); // 'as any' fixes the TypeScript build error

    console.log(`Attempting to send email to ${to}...`);

    await transporter.sendMail({
      from: `"IT Help Desk" <${process.env.EMAIL_USER}>`,
      to,
      subject: "IT Support Ticket Confirmation",
      text: `Your IT support ticket has been created successfully.

Ticket ID: ${ticketId}
Issue: ${issue}
Service Fee: $${price}

Thank you,
IT Help Desk`,
    });

    // Success
    return true; 

  } catch (error) {
    console.error("EMAIL FAILED (Non-fatal):", error);
    // Failure (but app continues)
    return false;
  }
};
