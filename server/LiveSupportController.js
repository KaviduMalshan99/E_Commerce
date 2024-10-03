const express = require('express');
const router = express.Router();

// Temporary storage for live support queries
let liveSupportQueue = [];

// API to transfer query to live support
router.post('/transfer', (req, res) => {
    const { userQuery, userId, sessionId } = req.body;

    // Check if a live support session already exists for this sessionId
    const existingSession = liveSupportQueue.find((session) => session.sessionId === sessionId);

    if (existingSession) {
        // If session exists, append the new message to its messages array
        existingSession.messages.push({ sender: 'user', text: userQuery });
    } else {
        // Create a new session if it doesn't exist
        liveSupportQueue.push({
            userId,
            sessionId,
            userQuery,
            status: 'pending',
            transferredAt: new Date(),
            messages: [{ sender: 'user', text: userQuery }]
        });
    }

    console.log('Query transferred to live support:', userQuery, sessionId);
    return res.status(200).json({ message: 'Query transferred to live support' });
});


router.post('/forward', (req, res) => {
    const { userQuery, sessionId } = req.body;
  
    // Ensure the session exists in the liveSupportQueue
    const session = liveSupportQueue.find(query => query.sessionId === sessionId);
    if (session) {
      session.messages.push({ sender: 'user', text: userQuery });
  
      // Emit to the live support dashboard using the socket
      req.app.get('socketio').emit('receiveMessageFromUser', { sessionId, message: userQuery });
      
      return res.status(200).json({ message: 'Message forwarded to live agent' });
    }
  
    return res.status(404).json({ error: 'Session not found' });
  });
  

// API for live agents to fetch unresolved queries and chat history
router.get('/unresolved', (req, res) => {
    const unresolvedQueries = liveSupportQueue.filter(query => query.status === 'pending');
    console.log('Current unresolved queries:', unresolvedQueries);
    res.status(200).json(unresolvedQueries);
});

// API for live agents to respond to queries
router.post('/respond', (req, res) => {
    const { sessionId, response } = req.body;

    // Find the unresolved query by sessionId
    const session = liveSupportQueue.find(query => query.sessionId === sessionId && query.status === 'pending');
    if (session) {
        // Emit the agent's message to the user through Socket.IO
        req.app.get('socketio').to(session.userSocketId).emit('messageFromAgent', response);

        // Append agent's response to messages array
        session.messages.push({ sender: 'agent', text: response });

        return res.status(200).json({ message: 'Message sent to user' });
    }

    return res.status(404).json({ error: 'Unresolved query not found' });
});

// API to resolve live support session
router.post('/resolve', (req, res) => {
    const { sessionId } = req.body;

    // Find the live support session
    const session = liveSupportQueue.find(query => query.sessionId === sessionId);
    if (session) {
        session.status = 'resolved'; // Mark the session as resolved
        return res.status(200).json({ message: 'Live support session resolved' });
    }

    return res.status(404).json({ error: 'Session not found' });
});

// API to fetch chat history for a specific session
router.get('/chat-history/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const session = liveSupportQueue.find(query => query.sessionId === sessionId);
    if (session) {
        return res.status(200).json({ chatHistory: session.messages });
    }
    return res.status(404).json({ error: 'Session not found' });
});

module.exports = router;
