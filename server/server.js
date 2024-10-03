require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const admin = require("firebase-admin");
const { chatbot, activateLiveSupport } = require('./ChatbotController');
const router = require('./router');
const http = require('http');
const socketIo = require('socket.io');
const imageSearchRoute = require('./imageSearch'); // Import the image search route
const liveSupportController = require('./LiveSupportController');

// Firebase Admin Initialization
const credentials = require("./util/firebase/credentials.json");

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app); // Create HTTP server from express app

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',  // Replace with your frontend URL
    methods: ['GET', 'POST'],
  },
  path: '/socket.io',  // Ensure this path is consistent on both frontend and backend
});


let liveSupportSessions = {}; // Initialize liveSupportSessions on server level

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Store the user's session when they join the chat
  socket.on('joinChat', ({ sessionId }) => {
    liveSupportSessions[sessionId] = { userSocketId: socket.id, active: false };
    console.log(`Session ${sessionId} has connected with socket ${socket.id}`);
  });

  socket.on('sendMessageToUser', ({ sessionId, message }) => {
    const clientSocket = liveSupportSessions[sessionId]?.userSocketId;
    if (clientSocket) {
      io.to(clientSocket).emit('messageFromAgent', message);
    } else {
      console.log(`No active session found for sessionId: ${sessionId}`);
    }
  });

  // Forwarding user message to the agent's dashboard
  socket.on('forwardUserMessageToAgent', ({ sessionId, message }) => {
    // Emit the message to all clients (live support dashboard)
    io.emit('receiveMessageFromUser', { sessionId, message }); 
  });

  // Handle resolveSession event from LiveSupportDashboard
  socket.on('resolveSession', ({ sessionId }) => {
    // Emit an event to the chatbot to notify that the session is resolved
    const clientSocket = liveSupportSessions[sessionId]?.userSocketId;
    if (clientSocket) {
      io.to(clientSocket).emit('sessionResolved');
    }

    // Remove the session after it's resolved
    delete liveSupportSessions[sessionId];
    console.log(`Live support session ${sessionId} has been resolved and removed.`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Optionally handle session cleanup on disconnect
  });
});


admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

// File Upload Setup
const upload = multer({ 
  dest: 'uploads/', 
  limits: { fileSize: 20 * 1024 * 1024 } // Limit set to 20MB
});

// Middleware Setup
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

// API Routes
app.post('/api/upload', upload.single('image'), (req, res) => {
  const filePath = req.file.path;
  res.json({ filePath });
});

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
    from: '"WellWorn Private Limited" <tracking@wellworn.lk>', // update this
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
    from: '"WellWorn Private Limited" <faq@wellworn.lk>', // update this
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




// Additional Routes
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  res.json({ user: 'user data', token: 'user session token' });
});


// Apply Routes
app.use('/api', router);
app.set('socketio', io);
app.use('/api', imageSearchRoute); // Mount the image search route under /api

// Add the Chatbot route
app.post('/api/chat', chatbot);  // Route for AI Chat Interface

app.use('/api/live-support', liveSupportController);


app.use(cors({
  origin: 'http://localhost:5173' // Add your frontend URL (Vite dev server) here
}));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});