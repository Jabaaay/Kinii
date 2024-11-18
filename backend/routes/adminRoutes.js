import express from "express";
import {getHistory, confirmAppointment, createAnnouncement, getAnnouncements, handleGoogleLogin, addStaff, updateProfile, getNotifications} from '../controllers/adminControllers.js'
import multer from "multer";


const router = express.Router();

router.get('/appointments', getHistory);


// router.put('/:id', confirmAppointment);

router.put('/confirm/:id', confirmAppointment);


const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);  // Accept the file
        } else {
            cb(new Error('Only image files are allowed!'), false);  // Reject the file
        }
    }
});

router.post('/announcements', upload.single('file'), createAnnouncement);

router.get('/announcements', getAnnouncements);

router.post('/google-login', handleGoogleLogin);

router.put('/update-profile/:googleId', updateProfile);

router.post('/add', addStaff);

router.get('/contact', getNotifications);

export default router;
