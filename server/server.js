require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
const router = require('./router');
const chatbotRoutes = require('./chatbotRoutes'); // Import chatbot routes

// Firebase Admin Initialization
const credentials = require("./util/firebase/credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

// File Upload Setup
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 20 * 1024 * 1024 } // Limit set to 20MB
});

// Middleware Setup
const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Set Headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// MongoDB Connection
const uri = process.env.MONGO_URI || 'mongodb+srv://spmproject:spmproject123@spmproject.6y1hw.mongodb.net/test?retryWrites=true&w=majority&appName=spmproject';
//mongodb+srv://wellwornsl:wellwornsl123@wellwornsl.ytwnfha.mongodb.net/test?retryWrites=true&w=majority

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connection Success..!!");
  } catch (error) {
    console.log("Connection Error", error);
  }
};

connect();

// API Routes for File Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;
  res.json({ filePath });
});

// API Routes for Sending Emails
app.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'mail.wellworn.lk', // SMTP server address
    port: 465, // SMTP port
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'tracking@wellworn.lk', // your cPanel email address
      pass: '123wellhelp#$' // your cPanel email password
    }
  });

  let mailOptions = {
    from: '"WellWorn Private Limited" <tracking@wellworn.lk>',
    to: email,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

app.post('/send-faq', async (req, res) => {
  const { email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'mail.wellworn.lk', // SMTP server address
    port: 465, // SMTP port
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'faq@wellworn.lk', // your cPanel email address
      pass: '123wellhelp#$' // your cPanel email password
    }
  });

  let mailOptions = {
    from: '"WellWorn Private Limited" <faq@wellworn.lk>',
    to: email,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

// API Route for Google Authentication
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  res.json({ user: 'user data', token: 'user session token' });
});

// Apply additional routes
app.use('/api', router);

// Apply Chatbot Routes
app.use('/api', chatbotRoutes); // Register chatbot routes

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
