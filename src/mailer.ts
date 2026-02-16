import nodemailer from "nodemailer";
import "dotenv/config"; // Ensure env vars are loaded here too just in case

export const sendConfirmationEmail = async (
  to: string,
  ticketId: number,
  issue: string,
  price: number
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Explicit Host
      port: 465,              // Explicit Secure Port (Best for Render)
      secure: true,           // True for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // SAFETY SETTINGS (Prevents the "Hang")
      connectionTimeout: 10000, // Wait max 10 seconds for connection
      greetingTimeout: 5000,    // Wait max 5 seconds for hello
      socketTimeout: 10000,     // Wait max 10 seconds for data
    });

    console.log(`Attempting to send email to ${to}...`);

    const info = await transporter.sendMail({
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

    console.log("Email sent successfully! ID:", info.messageId);
    return true; // Return success

  } catch (error) {
    // If email fails, we LOG it, but we return FALSE so the app doesn't crash
    console.error("EMAIL FAILED (Non-fatal):", error);
    return false;
  }
};
