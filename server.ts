import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Stateless in-memory storage for OTP verification codes
const otpStore = new Map<string, { code: string; expiresAt: number }>();

async function sendEmailHelper(to: string, subject: string, body: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSender = process.env.SMTP_SENDER || smtpUser || "no-reply@midnightfork.com";

  

  console.log("===== SMTP CONFIG =====");
  console.log("HOST:", smtpHost);
  console.log("PORT:", smtpPort);
  console.log("USER:", smtpUser);
  console.log("PASS:", smtpPass ? "Loaded" : "Missing");
  console.log("SENDER:", smtpSender);
  console.log("=======================");

  let transporter;
  let isTestAccount = false;
  let previewUrl = "";
  if (smtpHost && smtpUser && smtpPass) {
    // Use configured SMTP server
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      family: 4,
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
    } 
     catch (error: any) {
  console.error("========== SMTP ERROR ==========");
  console.error(error);
  console.error("Message:", error?.message);
  console.error("Code:", error?.code);
  console.error("Response:", error?.response);
  console.error("Response Code:", error?.responseCode);
  console.error("Command:", error?.command);
  console.error("================================");

  return res.status(500).json({
    success: false,
    message: error?.message || "Failed to dispatch verification email.",
  });
}
  });

  // API Route to generate and send verification OTP
  app.post("/api/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email address is required." 
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Generate random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Code valid for 5 minutes

    // Store OTP in memory
    otpStore.set(trimmedEmail, { code: otpCode, expiresAt });

    const subject = "Midnight Fork - Account Verification Code";
    const body = `Welcome to Midnight Fork late-night dining patron program!\n\nYour 6-digit account verification code is:\n\n${otpCode}\n\nThis verification code is valid for 5 minutes. Please use it to complete your enrollment. If you did not request this, please ignore this email.`;

    try {
      const result = await sendEmailHelper(trimmedEmail, subject, body);
      return res.status(200).json({
        success: true,
        message: result.isTestAccount ? "Simulated verification code sent!" : "Verification code sent successfully!",
        isTestAccount: result.isTestAccount,
        previewUrl: result.previewUrl,
      });
    } catch (error: any) {
      console.error("Failed to dispatch OTP email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to dispatch verification email.",
        error: error.message || error,
      });
    }
  });

  // API Route to verify OTP code
  app.post("/api/verify-otp", async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and verification code are required." 
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const storedOtp = otpStore.get(trimmedEmail);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "No verification code exists for this email address. Please request a new code."
      });
    }

    if (Date.now() > storedOtp.expiresAt) {
      otpStore.delete(trimmedEmail);
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code."
      });
    }

    if (storedOtp.code !== cleanCode) {
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code. Please check your email and try again."
      });
    }

    // Success - remove from map to prevent reuse
    otpStore.delete(trimmedEmail);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully!"
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
