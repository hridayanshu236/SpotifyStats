const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const router = express.Router();

const redirect_uri = 'http://localhost:3001/auth/callback';


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
  
      res.redirect(`http://localhost:3000/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;