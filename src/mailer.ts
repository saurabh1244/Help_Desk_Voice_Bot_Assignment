import nodemailer from "nodemailer";

export const sendConfirmationEmail = async (
  to: string,
  ticketId: number,
  issue: string,
  price: number
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "IT Support Ticket Confirmation",
    text: `Your IT support ticket has been created successfully.

Ticket ID: ${ticketId}
Issue: ${issue}
Service Fee: $${price}

Thank you,
IT Help Desk`
  });
};
