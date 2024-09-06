const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const router = express.Router();


const redirect_uri = `${process.env.BACKEND_URL}/auth/callback`;
const client_id = process.env.SPOTIFY_CLIENT_ID; // Ensure this is defined in your environment variables

console.log('Redirect URI:', redirect_uri); // Debug log

router.use(cookieParser());

// Generate a random string for the state parameter
const generateRandomString = length => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

router.get('/login', (req, res) => {
    console.log("Trying logging in");
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-top-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});
router.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;

        // Set tokens as cookies
        res.cookie('accessToken', access_token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV,
                sameSite: 'None'
            });
        res.cookie('refreshToken', refresh_token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV,
                sameSite: 'None'
            });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Endpoint to check if the user is authenticated
router.get('/status', (req, res) => {
    if (req.cookies.accessToken) {
        res.json({
            authenticated: true,
            accessToken: req.cookies.accessToken // Assuming you need to pass this
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

router.post('/logout', (req, res) => {
    // Clear the cookies
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: 'None'

    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: 'None'
    });


    // Respond with a success message or redirect
    res.json({ message: 'Successfully logged out' });
});


module.exports = router;