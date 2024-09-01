const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Use the environment variable
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies and credentials
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
//Routes for handling Spotify oAuth
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})