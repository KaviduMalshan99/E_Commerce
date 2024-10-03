import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LiveSupportDashboard.scss'; // Custom styles
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connect to Socket.IO server

const LiveSupportDashboard = () => {
  const [unresolvedQueries, setUnresolvedQueries] = useState([]); // Store unresolved queries
  const [loading, setLoading] = useState(false); // For loading state
  const [selectedQuery, setSelectedQuery] = useState(null); // Store selected query for response
  const [response, setResponse] = useState(''); // Store agent response
  const [chatHistory, setChatHistory] = useState([]); // Store chat history for selected query

  // Fetch unresolved queries from the server when component mounts
  useEffect(() => {
    const fetchUnresolvedQueries = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3001/api/live-support/unresolved');
        setUnresolvedQueries(res.data);
      } catch (err) {
        console.error('Error fetching unresolved queries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnresolvedQueries();
  }, []);

  useEffect(() => {
    // Listen for incoming messages from the chatbot/user
    socket.on('receiveMessageFromUser', (message) => {
      console.log('Real-time message received:', message);
  
      // Update the selected query and chat history in real-time
      if (selectedQuery && selectedQuery.sessionId === message.sessionId) {
        setChatHistory((prev) => [...prev, { sender: 'user', text: message.message }]);
  
        // Update unresolved queries with the latest message
        setSelectedQuery((prevQuery) => ({
          ...prevQuery,
          messages: [...prevQuery.messages, { sender: 'user', text: message.message }],
        }));
      }
  
      // Update unresolved queries list for real-time display
      setUnresolvedQueries((prev) =>
        prev.map((query) => {
            if (query.sessionId === message.sessionId) {
                // Update messages only if not already present in chatHistory
                return {
                  ...query,
                  messages: [...chatHistory] // Sync with chatHistory to avoid duplication
                };
              }
          return query;
        })
      );
    });
  
    // Cleanup socket connection on unmount
    return () => {
      socket.off('receiveMessageFromUser');
    };
  }, [selectedQuery]);
  

  // Handle sending a response to the user
  const handleSendResponse = async () => {
    if (!selectedQuery || !response.trim()) return;

    try {
      setLoading(true);
      // Send response to the backend for processing
      await axios.post('http://localhost:3001/api/live-support/respond', {
        sessionId: selectedQuery.sessionId,
        response,
      });

      // Emit the message to the user via socket
      socket.emit('sendMessageToUser', { sessionId: selectedQuery.sessionId, message: response });

      // Update chat history immediately after sending the message
      setChatHistory((prev) => [...prev, { sender: 'agent', text: response }]);

      // Clear the response field
      setResponse('');
    } catch (err) {
      console.error('Error sending response:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle resolving the session
// Inside handleResolveSession in LiveSupportDashboard.jsx
const handleResolveSession = async () => {
    if (!selectedQuery) return;
  
    try {
      await axios.post('http://localhost:3001/api/live-support/resolve', {
        sessionId: selectedQuery.sessionId,
      });
  
      // Inform the chatbot that live support has been resolved
      socket.emit('resolveSession', { sessionId: selectedQuery.sessionId });
  
      // Update frontend to remove the unresolved query
      setUnresolvedQueries(unresolvedQueries.filter((query) => query.sessionId !== selectedQuery.sessionId));
      setSelectedQuery(null);
      setChatHistory([]);
    } catch (err) {
      console.error('Error resolving session:', err);
    }
  };
  

  // When the agent selects a query, fetch the chat history for that session
  const handleSelectQuery = (query) => {
    setSelectedQuery(query);
    setChatHistory(query.messages || []); // Populate the chat history for the selected session
  };

  return (
    <div className="dashboard-container">
      <h2>Live Support Dashboard</h2>

      {loading ? (
        <p>Loading unresolved queries...</p>
      ) : unresolvedQueries.length === 0 ? (
        <p>No unresolved queries at the moment.</p>
      ) : (
        <div className="dashboard-content">
          <div className="queries-list">
            <h3>Unresolved Queries</h3>
            <ul>
              {unresolvedQueries.map((query) => (
                <li key={query.sessionId} onClick={() => handleSelectQuery(query)}>
                  {query.userQuery} ({new Date(query.transferredAt).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>

          {selectedQuery && (
            <div className="response-section">
              <h3>Live Chat with Customer</h3>

              <div className="chat-history">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <p>{msg.text}</p> 
                  </div>
                ))}
              </div>

              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                rows={4}
                className="response-input"
              />
              <button onClick={handleSendResponse} disabled={loading || !response.trim()} className="send-response-btn">
                {loading ? 'Sending...' : 'Send Response'}
              </button>

              <button onClick={handleResolveSession} className="resolve-btn">
                Resolve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveSupportDashboard;
