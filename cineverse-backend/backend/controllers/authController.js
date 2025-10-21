const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ====================== EMAIL SETUP (FINAL WORKING) ======================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // ✅ Force STARTTLS
  secure: false, // ✅ Must be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (no spaces)
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false, // avoid self-signed cert errors
  },
});

// ✅ SMTP Connection Test
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Connection Failed:", error.message);
  } else {
    console.log("✅ SMTP Server ready to send emails via port 587");
  }
});

// ✅ Helper: Send OTP or fallback to console
const sendOtpEmail = async (email, otp, subject) => {
  try {
    const mailOptions = {
      from: `"CineVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <h2>🎬 Welcome to CineVerse!</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:red; letter-spacing:4px;">${otp}</h1>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>If you didn’t request this, please ignore this message.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (err) {
    console.warn("⚠️ Email sending failed! Showing OTP in console instead.");
    console.log(`📩 Fallback OTP for ${email}: ${otp}`);
  }
};

// =========================================================
// 1️⃣ REGISTER + SEND OTP
// =========================================================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.otp = otp;
      existingUser.otpExpires = Date.now() + 5 * 60 * 1000;
      await existingUser.save();
      await sendOtpEmail(email, otp, "Resend: Verify your CineVerse account");
      return res
        .status(200)
        .json({ message: "New OTP sent to your email for verification." });
    }

    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await user.save();
    await sendOtpEmail(email, otp, "Verify your CineVerse account");

    res.status(201).json({
      message: "OTP sent to your email for verification.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// 2️⃣ VERIFY OTP AFTER REGISTRATION
// =========================================================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// 3️⃣ USER LOGIN (only if verified)
// =========================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET || "mysecretkey",
        { expiresIn: "7d" }
      );
      return res.status(200).json({
        message: "Admin login successful",
        role: "admin",
        token,
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email via OTP before login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", role: "user", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// 4️⃣ FORGOT PASSWORD — SEND OTP
// =========================================================
exports.requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp, "CineVerse Password Reset OTP");
    res
      .status(200)
      .json({ message: "Password reset OTP sent to your email." });
  } catch (error) {
    console.error("Request reset OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================================================
// 5️⃣ RESET PASSWORD USING OTP
// =========================================================
exports.resetPasswordOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset password via OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
