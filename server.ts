import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Stateless in-memory storage for pending email registration links
const verificationStore = new Map<string, { 
  token: string; 
  name: string; 
  email: string; 
  password: string; 
  phone: string; 
  address: string; 
  expiresAt: number; 
}>();

async function sendEmailHelper(to: string, subject: string, body: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSender = process.env.SMTP_SENDER || smtpUser || "no-reply@midnightfork.com";

  let transporter;
  let isTestAccount = false;
  let previewUrl = "";

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

  return {
    success: true,
    messageId: info.messageId,
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

  // API Route to generate and send verification email link
  app.post("/api/send-verification-link", async (req, res) => {
    const { name, email, password, phone, address, origin } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email address, and password are required." 
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    // Generate a secure, unique token for this registration attempt
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = Date.now() + 15 * 60 * 1000; // valid for 15 minutes

    // Store pending registration details in memory
    verificationStore.set(token, {
      token,
      name,
      email: trimmedEmail,
      password,
      phone: phone || "",
      address: address || "",
      expiresAt
    });

    const clientOrigin = origin || "http://localhost:3000";
    const verificationLink = `${clientOrigin}/?verify-token=${token}`;

    const subject = "Midnight Fork - Verify Your Account Registration";
    const body = `Welcome to the Midnight Fork late-night dining patron program!\n\nPlease click the link below to verify your email and complete your enrollment:\n\n${verificationLink}\n\nThis verification link is valid for 15 minutes. If you did not request this, please ignore this email.`;

    try {
      const result = await sendEmailHelper(trimmedEmail, subject, body);
      return res.status(200).json({
        success: true,
        message: result.isTestAccount ? "Simulated verification link sent!" : "Verification link sent successfully!",
        isTestAccount: result.isTestAccount,
        previewUrl: result.previewUrl,
      });
    } catch (error: any) {
      console.error("Failed to dispatch verification email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to dispatch verification email.",
        error: error.message || error,
      });
    }
  });

  // API Route to verify registration token and retrieve temporary data
  app.post("/api/verify-registration-token", async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: "Verification token is required." 
      });
    }

    const pending = verificationStore.get(token);

    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired. Please register again."
      });
    }

    if (Date.now() > pending.expiresAt) {
      verificationStore.delete(token);
      return res.status(400).json({
        success: false,
        message: "Verification link has expired. Please register again."
      });
    }

    // Success - remove from map to prevent reuse/replay
    verificationStore.delete(token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      registration: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
        phone: pending.phone,
        address: pending.address
      }
    });
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
