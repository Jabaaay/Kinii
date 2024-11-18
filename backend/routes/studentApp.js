import express from "express";
import {getHistory, addApp, cancelApp, updateApp, getAnnouncements, handleGoogleLogin, logoutController, updateProfile, submitContactForm} from '../controllers/studentApp.js'
import multer from "multer";


const router = express.Router();

router.get('/appointments', getHistory);

router.post('/appointments', addApp);

router.delete('/appointments/:id', cancelApp);

router.put('/appointments/:id', updateApp);

router.get('/announcements', getAnnouncements);

router.post('/google-login', handleGoogleLogin);

router.put('/update-profile/:googleId', updateProfile);

router.post('/logout', logoutController);

router.post('/contact', submitContactForm);


export default router;

