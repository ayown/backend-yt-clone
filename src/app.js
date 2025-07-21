import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json({limit: '10mb'})); // Increase the limit to 10mb
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase the limit to 10mb
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser()); // Parse cookies

// Import routes
import userRoutes from './routes/user.route.js';

// Declaration of routes
app.use('/api/v1/users', userRoutes);



export { app, PORT };