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
      // --- THE FIX IS HERE ---
      // Force IPv4 because IPv6 often times out on cloud servers
      family: 4, 
      // -----------------------
      connectionTimeout: 10000,
      greetingTimeout: 5000, 
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
    return true; 

  } catch (error) {
    console.error("EMAIL FAILED (Non-fatal):", error);
    return false;
  }
};
