import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import Admin from '../models/admin.js';

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
    
    // Check in both User and Admin collections
    let user = await User.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const verificationCode = generateVerificationCode();
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const mailOptions = {
      from: {
        name: 'University Guidance',
        address: process.env.EMAIL_USER || 'universityguidance.noreply@gmail.com'
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
    
    // Check in both User and Admin collections
    let user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      user = await Admin.findOne({
        email,
        resetPasswordCode: code,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // If code is valid, send success response
    res.json({ message: 'Code verified successfully' });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Error verifying code' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user without explicitly setting googleId
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      course: "",
      department: ""
      // googleId will be generated automatically
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      userId: newUser._id
    });

  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration',
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        email: user.email,
        name: user.name,
        googleId: user.googleId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set session
    req.session.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        googleId: user.googleId,
        picture: user.picture,
        course: user.course,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing login',
      error: error.message
    });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const { name, email, password, role, position, picture } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin/staff user
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
      position,
      picture,
      googleId: uuidv4() // Generate a unique googleId
    });

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin/Staff registered successfully',
      token,
      userId: newAdmin._id
    });

  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration',
      error: error.message
    });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Check in both User and Admin collections
    let user = await User.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify that the code was validated
    const isVerified = user.resetPasswordCode !== undefined && 
                      user.resetPasswordExpires > Date.now();

    if (!isVerified) {
      return res.status(400).json({ message: 'Password reset not authorized' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

export default router; 