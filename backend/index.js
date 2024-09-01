const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

//Routes for handling Spotify oAuth
app.use('/auth',authRoutes);

app.listen(port, ()=> {
    console.log(`Server is running on ${port}`);
})