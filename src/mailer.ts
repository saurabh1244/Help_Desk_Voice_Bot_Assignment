import { Resend } from 'resend';
import "dotenv/config";

// Using your provided API Key
const resend = new Resend(process.env.RESEND_API_KEY || "re_Zjz6Rzd3_G5T9FooNgxDtn561yLs7wsQC");

export const sendConfirmationEmail = async (
  to: string,
  ticketId: number,
  issue: string,
  price: number
) => {
  try {
    console.log(`Attempting to send email to ${to} via Resend API...`);

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default free-tier sender
      to: [to], 
      subject: `IT Support: Ticket #${ticketId} Created`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Ticket Confirmation</h2>
          <p>Your IT support ticket has been created successfully.</p>
          <ul>
            <li><strong>Ticket ID:</strong> ${ticketId}</li>
            <li><strong>Issue:</strong> ${issue}</li>
            <li><strong>Service Fee:</strong> $${price}</li>
          </ul>
          <p>We will contact you shortly.</p>
          <hr />
          <p><em>Thank you, IT Help Desk Team</em></p>
        </div>
      `
    });

    if (error) {
      console.error("Resend API Error:", error);
      return false;
    }

    console.log("Email sent successfully via Resend! ID:", data?.id);
    return true;

  } catch (err) {
    console.error("Unexpected error in Resend mailer:", err);
    return false;
  }
};