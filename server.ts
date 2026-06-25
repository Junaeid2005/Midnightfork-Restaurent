import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to send email
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters: to, subject, body." 
      });
    }

    // SMTP Config from Environment Variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSender = process.env.SMTP_SENDER || smtpUser || "no-reply@midnightfork.com";

    try {
      let transporter;
      let isTestAccount = false;
      let previewUrl = "";

      if (smtpHost && smtpUser && smtpPass) {
        // Use configured SMTP server
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
        console.log(`Using custom SMTP transport: ${smtpHost}:${smtpPort}`);
      } else {
        // Fallback to test account on ethereal.email
        isTestAccount = true;
        console.log("SMTP environment variables not configured. Creating Ethereal test account...");
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
      }

      const mailOptions = {
        from: isTestAccount ? `"Midnight Fork (Simulated)" <${transporter.options.auth?.user}>` : `"Midnight Fork" <${smtpSender}>`,
        to,
        subject,
        text: body,
        html: body.replace(/\n/g, "<br>"),
      };

      const info = await transporter.sendMail(mailOptions);

      if (isTestAccount) {
        previewUrl = nodemailer.getTestMessageUrl(info) || "";
        console.log(`Simulated Email Sent! Preview URL: ${previewUrl}`);
      } else {
        console.log(`Real Email Sent! Message ID: ${info.messageId}`);
      }

      return res.status(200).json({
        success: true,
        message: isTestAccount ? "Simulated email sent successfully!" : "Real email sent successfully!",
        messageId: info.messageId,
        isTestAccount,
        previewUrl,
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
