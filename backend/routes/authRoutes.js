import express from 'express';
import bcrypt from 'bcryptjs';
import Staff from '../models/staffModels.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure nodemailer (reuse the same configuration)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'universityguidance.noreply@gmail.com',
    pass: 'xfoy rlig vnbl jrlo'
  }
});

// Generate random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const verificationCode = generateVerificationCode();
    staff.resetPasswordCode = verificationCode;
    staff.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await staff.save();

    const mailOptions = {
      from: {
        name: 'University Guidance',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Verification Code',
      html: `
        <h1>Password Reset Request</h1>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 1 hour.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification code sent successfully' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error sending verification code' });
  }
});

router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const staff = await Staff.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!staff) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // If code is valid, send success response
    res.json({ message: 'Code verified successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error verifying code' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    staff.password = hashedPassword;
    staff.resetPasswordCode = undefined;
    staff.resetPasswordExpires = undefined;
    await staff.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default router; 