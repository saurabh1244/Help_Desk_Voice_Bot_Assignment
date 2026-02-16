import * as BREVO from '@getbrevo/brevo';
import "dotenv/config";

// API Instance initialize karein
const apiInstance = new BREVO.TransactionalEmailsApi();

// Authentication setup
apiInstance.setApiKey(BREVO.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || "");

export const sendConfirmationEmail = async (
  to: string, 
  ticketId: number, 
  issue: string, 
  price: number
) => {
  try {
    const sendSmtpEmail = new BREVO.SendSmtpEmail();

    sendSmtpEmail.subject = "Support Ticket Confirmation";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #007bff;">Ticket Created Successfully</h2>
        <p>Your IT support ticket has been registered.</p>
        <p><strong>Ticket ID:</strong> #${ticketId}</p>
        <p><strong>Issue:</strong> ${issue}</p>
        <p><strong>Total Amount:</strong> $${price}</p>
        <br/>
        <p>Regards,<br/>IT Help Desk Team</p>
      </div>`;
    
    // Aapka verified Brevo email
    sendSmtpEmail.sender = { name: "IT Help Desk", email: process.env.SENDER_EMAIL || "" };
    sendSmtpEmail.to = [{ email: to }];

    console.log(`Sending email to ${to} via Brevo API...`);
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Brevo Success:", result.response.statusCode);
    
    return true;
  } catch (error: any) {
    console.error("Brevo API Error:");
    if (error.response && error.response.body) {
      console.error(JSON.stringify(error.response.body));
    } else {
      console.error(error.message);
    }
    return false;
  }
};