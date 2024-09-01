const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const router = express.Router();


const redirect_uri = `${process.env.BACKEND_URL}/auth/callback`;
console.log('Redirect URI:', redirect_uri); // Debug log

router.use(cookieParser());

router.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email user-top-read';
    const queryParams = querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri,
        scope
    });
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
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
        res.cookie('accessToken', access_token, { httpOnly: true, secure: process.env.NODE_ENV });
        res.cookie('refreshToken', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV });

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
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Optionally, you can also handle session destruction here if applicable

    // Respond with a success message or redirect
    res.json({ message: 'Successfully logged out' });
});


module.exports = router;