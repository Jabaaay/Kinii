import express from "express";
import {getHistory, confirmAppointment, createAnnouncement, getAnnouncements, handleGoogleLogin, addStaff, updateProfile, getNotifications} from '../controllers/adminControllers.js'
import multer from "multer";
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import StudentApp from '../models/studentApp.js';
import { transporter } from '../config/nodemailer.js';
import User from '../models/users.js';

const router = express.Router();

// Add the credentials loading function
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

router.get('/appointments', getHistory);

router.put('/confirm/:id', confirmAppointment);

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.post('/export-to-sheets', async (req, res) => {
  try {
    console.log('Starting export process...');
    
    // Fetch appointments from MongoDB
    const appointments = await StudentApp.find({}).sort({ date: -1 });
    console.log('Fetched appointments:', appointments.length);

    // Format the data for sheets
    const formattedData = appointments.map(app => [
      app.userName,
      app.department,
      app.appType,
      app.purpose,
      app.date,
      app.time
    ]);

    const credentials = await loadCredentials();
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ],
      timeout: 30000
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });

    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `Appointments Report ${new Date().toLocaleDateString()}`,
        }
      }
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    // Set permissions
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'anyone'
      }
    });

    // Add headers and data
    const headers = [['Name', 'College', 'Appointment Type', 'Purpose', 'Date', 'Time']];
    const values = [...headers, ...formattedData];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;
    
    return res.json({
      success: true,
      spreadsheetUrl,
      message: 'Spreadsheet created successfully'
    });

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ 
      error: 'Failed to export to Google Sheets',
      details: error.message
    });
  }
});

router.post('/announcements', upload.single('file'), createAnnouncement);

router.get('/announcements', getAnnouncements);

router.post('/google-login', handleGoogleLogin);

router.put('/update-profile/:googleId', updateProfile);

router.post('/add', addStaff);

router.get('/contact', getNotifications);

router.post('/invite-staff', async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log('Attempting to send email to:', email);
    
    let existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      existingUser = new User({
        name,
        email,
        role: 'Staff',
        lastInviteSent: new Date(),
        inviteCount: 1
      });
      await existingUser.save();
    }

    const mailOptions = {
      from: {
        name: 'University Guidance',
        address: 'universityguidance.noreply@gmail.com'
      },
      to: email,
      subject: 'Staff Invitation',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>You have been invited to join as a staff member.</p>
        <p>Please click the link below to complete your registration:</p>
        <a href="${process.env.FRONTEND_URL}/sign-up">Complete Registration</a>
        ${existingUser.inviteCount > 1 ? '<p><i>Note: This is a reminder of your previous invitation.</i></p>' : ''}
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ 
      message: existingUser.inviteCount > 1 ? 'Invitation resent successfully' : 'Invitation sent successfully',
      staff: existingUser 
    });

  } catch (error) {
    console.error('Error in invite-staff:', error);
    res.status(500).json({ message: 'Failed to send invitation', error: error.message });
  }
});

// Test email route
router.get('/test-email', async (req, res) => {
  try {
    await transporter.verify();
    const testResult = await transporter.sendMail({
      from: 'universityguidance.noreply@gmail.com',
      to: 'universityguidance.noreply@gmail.com',
      subject: 'Test Email',
      text: 'If you receive this, email sending is working!'
    });
    res.json({ message: 'Test successful', info: testResult });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
