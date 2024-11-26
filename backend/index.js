import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('Required environment variables are missing');
  process.exit(1);
}

// Log the environment variables (remove in production)
console.log('Email Config:', {
  user: process.env.EMAIL_USER,
  passLength: process.env.EMAIL_PASSWORD?.length
});

const app = express();
const PORT = process.env.PORT;





// Middleware for CORS
const corsOptions = {
    origin: ["http://localhost:5173"], 
    credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware here
app.use(express.json()); // Middleware to parse JSON payloads

app.use(session({
    secret: process.env.JWT_SECRET || '2271f86972e5f403a57dce39775e05a2643c481949697ca7ddb84b3fa7bcbe6b40a5065b0a1b52731b38ace2f736df341f5e4adff82af1494e284f91fafff9c1',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Import the logout routes
import logoutRoutes from './routes/studentApp.js'

// Use the logout routes
app.use(logoutRoutes);


// Import routes
import studentRoute from './routes/studentApp.js';
import adminRoute from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Use routes with proper prefixes
app.use('/api', studentRoute);
app.use('/admin', adminRoute);
app.use('/api/auth', authRoutes);

app.use('/uploads', express.static('uploads'));



// Database connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
    } catch (error) {
        console.error('Error connecting to DB:', error);
    }
};

// Mongoose event listeners
mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from DB');
});

mongoose.connection.on('connected', () => {
    console.log('Connected to DB');
});





app.listen(PORT, () => {
    connect();
    console.log(`Listening on port ${PORT}`);
});