// File: googleAuthRoutes.js
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.169065311100-teurpru54dqmh09mb5er3tc473n7fob1.apps.googleusercontent.com);

// Function to verify the token and find/create the user in the database
async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.169065311100-teurpru54dqmh09mb5er3tc473n7fob1.apps.googleusercontent.com,  
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  return payload;
}

router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const userData = await verifyToken(token);
    // Respond with user data and a session token or an error message
    res.json({ user: userData, token: 'session token here' });
  } catch (error) {
    console.error('Failed to verify Google token:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

module.exports = router;
