import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Add this to verify the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log("Error verifying mail credentials:", error);
  } else {
    console.log("Mail server connection successful");
  }
});

router.post('/invite-staff', async (req, res) => {
  try {
    const { name, email, position } = req.body;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Staff Account Invitation',
      html: `
        <h1>Welcome to Our Team!</h1>
        <p>Dear ${name},</p>
        <p>You have been invited to join as a staff member (${position}).</p>
        <p>Your account has been created with the following credentials:</p>
        <p>Email: ${email}</p>
        <p>Temporary Password: ${generateTemporaryPassword()}</p>
        <p>Please change your password after first login.</p>
      `
    });

    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Failed to send invitation' });
  }
});

function generateTemporaryPassword() {
  return Math.random().toString(36).slice(-8);
}

export default router; 