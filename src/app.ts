import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma";
import { sendConfirmationEmail } from "./mailer";

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (_req, res) => {
  res.send("Express server is running");
});

app.post("/create-ticket", async (req, res) => {

  try {
    const { name, email, phone, address, issue } = req.body;

    console.log("Parsed data from VAPI:", {
      name,
      email,
      phone,
      address,
      issue,
    });

    if (!issue) {
      return res.status(400).json({ error: "Issue is required" });
    }

    const ISSUE_PRICE_MAP: Record<string, { issue: string; price: number }> = {
      wifi: { issue: "Wi-Fi not working", price: 20 },
      email: { issue: "Email login issues - password reset", price: 15 },
      slow: { issue: "Slow laptop performance - CPU change", price: 25 },
      printer: { issue: "Printer problems - power plug change", price: 10 },
    };

    const issueText = issue.toLowerCase().replace(/[^a-z]/g, "");

    const selected = issueText.includes("wifi")
      ? ISSUE_PRICE_MAP.wifi
      : issueText.includes("email")
        ? ISSUE_PRICE_MAP.email
        : issueText.includes("slow")
          ? ISSUE_PRICE_MAP.slow
          : issueText.includes("printer")
            ? ISSUE_PRICE_MAP.printer
            : null;

    if (!selected) {
      return res.status(400).json({ error: "Unsupported issue" });
    }


    const ticket = await prisma.ticket.create({
      data: {
        name,
        email,
        phone,
        address,
        issue: selected.issue,
        price: selected.price,
      },
    });


    try {
        console.log("Sending email to:", email);
        await sendConfirmationEmail(email, ticket.id, ticket.issue, ticket.price);
        console.log("Email sent successfully");
    } catch (emailError) {
        console.error("Email failed but ticket created:", emailError);
        // We do NOT stop the response here. 
    }


    const responsePayload = {
      ticketId: ticket.id,
      issue: ticket.issue,
      price: ticket.price,
    };



    res.json(responsePayload);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/update-ticket", async (req, res) => {
  const { ticketId, name, email, phone, address } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: "ticketId is required" });
  }

  const updateData: any = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticketId },
    data: updateData,
  });

  res.json({
    message: "Ticket updated successfully",
    ticketId: updated.id,
    updatedFields: Object.keys(updateData),
  });
});



app.get("/tickets", async (_req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

