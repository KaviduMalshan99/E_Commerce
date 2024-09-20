import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ChatbotComponent.scss'; // Import the SCSS file

const ChatbotComponent = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]); // Store both user and chatbot messages
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial greeting message
    setMessages([{ sender: 'chatbot', text: "Hi! Welcome to our store. What kind of product are you looking for today?" }]);
  }, []);

  const handleSendQuery = async () => {
    if (query.trim() === '') return; // Avoid sending empty queries

    // Add user's message to the chat
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setQuery('');

    try {
      setLoading(true);
      setRecommendations([]);

      const res = await axios.post('http://localhost:3001/api/chat', { query });
      setMessages((prev) => [...prev, { sender: 'chatbot', text: res.data.message }]);
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('Error in chatbot interaction:', err);
      setMessages((prev) => [...prev, { sender: 'chatbot', text: 'Error interacting with the chatbot.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents new line in the textarea
      handleSendQuery();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbox">
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}

          {recommendations.length > 0 && (
            <div className="product-recommendations">
              <h4>Recommended Products:</h4>
              <div className="products-list">
                {recommendations.map((product) => (
                  <div className="product-card" key={product.ProductId}>
                    {product.Variations && product.Variations.length > 0 ? (
                      <>
                        {/* Product Image with Labels */}
                        <div className="product-image-wrapper">
                          <img
                            src={product.Variations[0].image || 'placeholder.jpg'}
                            alt={product.ProductName}
                            className="product-image"
                          />
                          <div className="product-labels">
                            {product.Discount && <span className="product-label">Discount: {product.Discount}</span>}
                            {product.QuickDeliveryAvailable && <span className="product-label">Quick Delivery</span>}
                          </div>
                        </div>
                        <p className="product-name">{product.ProductName}</p>
                        <p className="product-price">${product.Variations[0].price}</p>
                        <p className="product-description">
                          Color: {product.Variations[0].color}, Size: {product.Variations[0].size}
                        </p>
                        <Link to={`/product/${product.ProductId}`}>
                          <button className="view-product-btn">View Product</button>
                        </Link>
                      </>
                    ) : (
                      <p>No variations available for this product</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="user-query-section">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about our products..."
            className="user-input"
            onKeyPress={handleKeyPress} // Handle Enter key press
          />
          <button onClick={handleSendQuery} disabled={loading} className="send-btn">
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotComponent;
