import express from "express";
import {getHistory, confirmAppointment, createAnnouncement, getAnnouncements, handleGoogleLogin, updateProfile, getNotifications, deleteNotification, deleteAnn, updateAnnouncement} from '../controllers/adminControllers.js'
import multer from "multer";
import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import StudentApp from '../models/studentApp.js';

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

router.get('/contact', getNotifications);

router.delete('/contact/:id', deleteNotification);

router.delete('/announcements/:id', deleteAnn);

router.put('/announcements/:id', upload.single('file'), updateAnnouncement);


export default router;
