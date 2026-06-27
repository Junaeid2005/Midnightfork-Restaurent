import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();



async function sendEmailHelper(to: string, subject: string, body: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSender = process.env.SMTP_SENDER || smtpUser || "no-reply@midnightfork.com";

  let transporter;
  let isTestAccount = false;
  let previewUrl = "";

  // Extract any HTTP/HTTPS URL from body as fallback previewUrl
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = body.match(urlRegex);
  const fallbackUrl = match ? match[0] : "";

  try {
    if (smtpHost && smtpUser && smtpPass) {
      // Use configured SMTP server
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      console.log(`Using custom SMTP transport: ${smtpHost}:${smtpPort}`);
    } else {
      // Fallback to test account on ethereal.email
      isTestAccount = true;
      console.log("SMTP environment variables not configured. Creating Ethereal test account...");
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (etherealErr) {
        console.warn("Could not create Ethereal test account (offline or ethereal.email down). Falling back to fully offline local simulation.", etherealErr);
        transporter = null;
      }
    }
  } catch (err) {
    console.warn("SMTP initialization failed. Falling back to offline simulation.", err);
    isTestAccount = true;
    transporter = null;
  }

  const fromAddress = transporter && transporter.options && transporter.options.auth 
    ? transporter.options.auth.user 
    : "sandbox-simulator@midnightfork.com";

  const mailOptions = {
    from: isTestAccount ? `"Midnight Fork (Simulated)" <${fromAddress}>` : `"Midnight Fork" <${smtpSender}>`,
    to,
    subject,
    text: body,
    html: body.replace(/\n/g, "<br>"),
  };

  let messageId = "simulated-msg-" + Math.random().toString(36).substring(2, 10);

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      messageId = info.messageId;
      if (isTestAccount) {
        previewUrl = nodemailer.getTestMessageUrl(info) || fallbackUrl;
        console.log(`Simulated Email Sent via Ethereal! Preview URL: ${previewUrl}`);
      } else {
        console.log(`Real Email Sent! Message ID: ${info.messageId}`);
      }
    } catch (sendErr: any) {
      console.error("Failed to send mail via custom SMTP transport:", sendErr);
      if (!isTestAccount) {
        // If they configured real SMTP, we should propagate the error so they know why it failed
        throw new Error(`SMTP Send Failure: ${sendErr.message || sendErr}`);
      }
      isTestAccount = true;
      previewUrl = fallbackUrl;
    }
  } else {
    isTestAccount = true;
    previewUrl = fallbackUrl;
    console.log(`Local Simulation: Verification email generated but not sent out. Fallback preview URL: ${previewUrl}`);
  }

  return {
    success: true,
    messageId,
    isTestAccount,
    previewUrl,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to send general email
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: to, subject, body." 
      });
    }

    try {
      const result = await sendEmailHelper(to, subject, body);
      return res.status(200).json({
        success: true,
        message: result.isTestAccount ? "Simulated email sent successfully!" : "Real email sent successfully!",
        messageId: result.messageId,
        isTestAccount: result.isTestAccount,
        previewUrl: result.previewUrl,
      });
    } catch (error: any) {
      console.error("Failed to send email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to dispatch email.",
        error: error.message || error,
      });
    }
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
