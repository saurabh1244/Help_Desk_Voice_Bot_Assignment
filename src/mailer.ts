import sgMail from '@sendgrid/mail';
import "dotenv/config";

// Key ab sirf .env se uthayega
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const sendConfirmationEmail = async (
  to: string,
  ticketId: number,
  issue: string,
  price: number
) => {
  try {
    console.log(`Attempting to send email to ${to} via SendGrid API...`);

    const msg = {
      to: to, 
      from: process.env.SENDER_EMAIL || 'sstcdurg@gmail.com', // Sender email bhi .env mein rakhein
      subject: `IT Support: Ticket #${ticketId} Confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #333;">Support Ticket Created</h2>
          <p>Your ticket has been successfully registered.</p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Issue:</strong> ${issue}</p>
          <p><strong>Service Fee:</strong> $${price}</p>
          <br/>
          <p>Regards,<br/>IT Help Desk Team</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully!");
    return true;

  } catch (error: any) {
    console.error("SendGrid API Error:", error);
    return false;
  }
};