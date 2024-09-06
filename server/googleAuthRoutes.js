// File: googleAuthRoutes.js
import { Router } from 'express';
const router = Router();
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to verify the token and find/create the user in the database
async function verifyToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // Here you would find or create a user in your database
  // And possibly generate a token for them
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

export default router;
