import express from 'express';
import nodemailer from 'nodemailer';
import Staff from '../models/staffModels.js';
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'universityguidance.noreply@gmail.com',
    pass: 'xfoy rlig vnbl jrlo'
  }
});

// Add better error logging
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
    console.error('Current settings:', {
      user: process.env.EMAIL_USER,
      passSet: !!process.env.EMAIL_PASSWORD
    });
  } else {
    console.log('Server is ready to take our messages');
  }
});

router.post('/invite-staff', async (req, res) => {
  try {
    const { name, email, position } = req.body;
    console.log('Attempting to send email to:', email);
    
    // Check if staff exists
    let existingStaff = await Staff.findOne({ email });
    
    if (!existingStaff) {
      // Create new staff member if doesn't exist
      existingStaff = new Staff({
        fullName: name,
        email: email,
        position: position,
        role: 'Staff'
      });
      await existingStaff.save();
    }

    // Send email regardless of whether staff exists
    const mailOptions = {
      from: {
        name: 'University Guidance',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Staff Invitation Reminder',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>You have been invited to join our staff as ${position}.</p>
        <p>Please click the link below to complete your registration:</p>
        <a href="${process.env.FRONTEND_URL}/adminLogin">Complete Registration</a>
        ${existingStaff ? '<p><i>Note: This is a reminder of your previous invitation.</i></p>' : ''}
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info);
      res.json({ 
        message: existingStaff.__v > 0 ? 'Invitation resent successfully' : 'Invitation sent successfully', 
        staff: existingStaff 
      });
    } catch (emailError) {
      console.error('Detailed email error:', emailError);
      res.status(500).json({ 
        message: 'Failed to send email',
        error: emailError.message,
        staff: existingStaff
      });
    }

  } catch (error) {
    console.error('Error in invite-staff:', error);
    res.status(500).json({ message: 'Failed to send invitation', error: error.message });
  }
});

// Add this temporary route for testing
router.get('/test-email', async (req, res) => {
  try {
    await transporter.verify();
    const testResult = await transporter.sendMail({
      from: 'universityguidance.noreply@gmail.com',
      to: 'universityguidance.noreply@gmail.com', // Send to yourself for testing
      subject: 'Test Email',
      text: 'If you receive this, email sending is working!'
    });
    res.json({ 
      message: 'Test successful', 
      info: testResult,
      config: {
        user: transporter.options.auth.user,
        passSet: !!transporter.options.auth.pass
      }
    });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ 
      error: error.message,
      config: {
        user: transporter.options.auth.user,
        passSet: !!transporter.options.auth.pass
      }
    });
  }
});

// Define the credentials loading function
async function loadCredentials() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  try {
    const credentialsPath = join(__dirname, '../config/google-credentials.json');
    const credentialsJson = await readFile(credentialsPath, 'utf8');
    return JSON.parse(credentialsJson);
  } catch (error) {
    console.error('Error loading credentials:', error);
    throw new Error('Failed to load Google credentials');
  }
}

router.post('/export-to-sheets', async (req, res) => {
  try {
    console.log('Starting export process...');
    
    const credentials = await loadCredentials();
    console.log('Credentials loaded:', {
      clientEmail: credentials.client_email,
      hasPrivateKey: !!credentials.private_key
    });

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
      timeout: 30000 // Increased timeout to 30 seconds
    });

    console.log('Creating API clients...');
    const sheets = google.sheets({ 
      version: 'v4', 
      auth,
      timeout: 30000
    });
    const drive = google.drive({ 
      version: 'v3', 
      auth,
      timeout: 30000
    });
    console.log('Sheets API client created');
    console.log('Drive API client created');

    // Verify data before creating spreadsheet
    if (!req.body.data || !Array.isArray(req.body.data)) {
      throw new Error('Invalid data format received');
    }

    console.log('Creating spreadsheet...');
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Appointments Report ${new Date().toLocaleDateString()}`,
        },
        sheets: [{
          properties: {
            title: 'Sheet1',
            gridProperties: {
              rowCount: Math.max(req.body.data.length + 1, 100),
              columnCount: 6
            }
          }
        }]
      },
      auth: auth
    });

    // After creating the spreadsheet, set permissions
    await drive.permissions.create({
      fileId: spreadsheet.data.spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'anyone'
      }
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    console.log('Spreadsheet created:', spreadsheetId);

    const headers = [['Name', 'College', 'Appointment Type', 'Purpose', 'Date', 'Time']];
    const values = [...headers, ...req.body.data];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;
    console.log('Export successful:', spreadsheetUrl);

    return res.json({
      success: true,
      spreadsheetUrl,
      message: 'Spreadsheet created successfully'
    });

  } catch (error) {
    console.error('Export error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      error: 'Failed to export to Google Sheets',
      details: error.message,
      code: error.code
    });
  }
});

export default router; 