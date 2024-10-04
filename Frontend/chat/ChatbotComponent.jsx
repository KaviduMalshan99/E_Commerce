import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatbotComponent.scss'; // Import the SCSS file
import search from "../../src/assets/search.png";
import upload from "../../src/assets/imageup.png";
import closeIcon from "../../src/assets/close.png"; // Import your close image
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
// Import all the images
import chat1 from '../../src/assets/chat_1 (1).png';
import chat2 from '../../src/assets/chat_1 (2).png';
import chat3 from '../../src/assets/chat_1 (3).png';
import chat4 from '../../src/assets/chat_1 (4).png';
import chat_1_5 from '../../src/assets/chat_1 (5).png';
import chat_1_6 from '../../src/assets/chat_1 (6).png';
import womenshoe from '../../src/assets/womenshoe.png';
import womenbag from '../../src/assets/womenbag.png'; 
// Initialize the Socket.IO client connection
const socket = io('http://localhost:3001', {
  path: '/socket.io',
  transports: ['websocket'],
});

const ChatbotComponent = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]); // Store both user and chatbot messages
  const [loading, setLoading] = useState(false);
  const [isLiveSupport, setIsLiveSupport] = useState(false); // Track if the session is transferred to live support
  const [selectedImage, setSelectedImage] = useState(null); // Store uploaded image
  const [imagePreview, setImagePreview] = useState(''); // Image preview before uploading

  const sessionId = localStorage.getItem('sessionId') || generateSessionId(); // Unique session ID per user

  function generateSessionId() {
    const newSessionId = 'session-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    localStorage.setItem('sessionId', newSessionId);
    return newSessionId;
  }

  useEffect(() => {
    // Initial greeting message
    setMessages([{ sender: 'chatbot', text: "Hi! Welcome to our store. What kind of product are you looking for today?" }]);

    // Join the chatroom for live support
    socket.emit('joinChat', { sessionId });

    // Listen for real-time messages from the live agent
    socket.on('messageFromAgent', (message) => {
      setMessages((prev) => [...prev, { sender: 'agent', text: message }]);
    });

    // Listen for session resolution event and reset the session
    socket.on('sessionResolved', () => {
      resetSession(); // Call function to reset the session
      setMessages((prev) => [...prev, { sender: 'chatbot', text: "Live support session has ended. How can I assist you next?" }]);
      setIsLiveSupport(false); // Reset live support state
    });

    return () => {
      socket.off('messageFromAgent');
      socket.off('sessionResolved'); // Clean up the listener on unmount
    };
  }, [sessionId]);

  const resetSession = () => {
    localStorage.removeItem('sessionId'); // Clear the session ID
    generateSessionId(); // Generate a new session ID for future interactions
  };

  const handleSendQuery = async () => {
    if (!query && !selectedImage) return; // Avoid sending if there's no query or image

    const newMessages = [...messages, { sender: 'user', text: query, image: imagePreview }];
    setMessages(newMessages);
    setQuery(''); // Clear the text input after submitting

    try {
      setLoading(true);

      if (selectedImage) {
        // Handle the image upload and search separately
        const formData = new FormData();
        formData.append('image', selectedImage); // Send the image for similarity search

        // Send the image to the image search endpoint
        const imageRes = await axios.post('http://localhost:3001/api/image-search', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Image search result:', imageRes.data);  // LOGGING THE RESPONSE TO CHECK THE DATA

        setMessages((prev) => [
          ...prev,
          { sender: 'chatbot', text: `Here are the similar products:`, recommendations: [imageRes.data.recommendations[0]] },
        ]);

        // Clear the image preview, selected image, and reset the input field for a new search
        setSelectedImage(null); // Clear the selected image state
        setImagePreview(''); // Clear the image preview
        document.querySelector('.image-upload-btn').value = ''; // Reset the file input field

      } else {
            const res = await axios.post('http://localhost:3001/api/chat', {
                query,
                sessionId,
                socketId: socket.id,
            });

            // Handle live support only for the first time
            if (res.data.requireLiveSupport && !isLiveSupport) {
                setIsLiveSupport(true); // Now live support is active
                setMessages((prev) => [
                    ...prev,
                    { sender: 'chatbot', text: 'Your query is being transferred to a live support agent.' }
                ]);
            } else if (isLiveSupport) {
                // For future messages, no need to notify about live support
                return; 
            } else {
                // Handle non-live support chatbot response
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'chatbot',
                        text: res.data.message,
                        link: res.data.link || null,
                        contact: res.data.contact || null,
                        recommendations: res.data.recommendations || [],
                    },
                ]);
            }
        }
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

  // Handle image selection (separate from sending)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file); // Store selected image
    setImagePreview(URL.createObjectURL(file)); // Show image preview before upload
  };

  const handleSendImage = async () => {
    if (!selectedImage) return; // Avoid sending if no image is selected

    // Send image to the backend for processing
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3001/api/image-search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Append the uploaded image and the result in the correct order
      setMessages((prev) => [
        ...prev,
        { sender: 'user', image: imagePreview }, // Add uploaded image
        { sender: 'chatbot', result: res.data }, // Add model result
      ]);
      setSelectedImage(null); // Clear selected image after sending
      setImagePreview(''); // Clear image preview after sending
    } catch (err) {
      console.error('Error in image search:', err);
      setMessages((prev) => [...prev, { sender: 'chatbot', text: 'Image search failed. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Add Header Component */}
    <Header />


    <div className="chatbot-page">
    {/* Gradient animated title */}
    <div className="chatbot-title">
      Welcome to FashionBot – Your Personal Bag & Shoe Finder!
    </div>

    <div className="chatbot-container">
      
      <div className="chatbox">
        {/* Chatbox content here */}
   

      {/* Corner images */}
      <img src={chat1} alt="Top Left Corner" className="corner-item top-left-corner" />
      <img src={chat2} alt="Top Right Corner" className="corner-item top-right-corner" />
      <img src={chat3} alt="Bottom Left Corner" className="corner-item bottom-left-corner" />
      <img src={chat4} alt="Bottom Right Corner" className="corner-item bottom-right-corner" />
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {/* Check if it's a text message */}
              {msg.text && !msg.link && !msg.linkPolicy && !msg.contact && <p className="agent-message">{msg.text}</p>}

              {/* Check for links */}
              {msg.link && (
                <div>
                  {msg.text && <p>{msg.text}</p>}
                  <a href={msg.link.url} target="_blank" rel="noopener noreferrer">
                    <button className="view-link-btn">{msg.link.text}</button>
                  </a>
                </div>
              )}

              {/* Check for refund policy link */}
              {msg.linkPolicy && (
                <div>
                  {msg.text && <p>{msg.text}</p>}
                  <a href={msg.linkPolicy.url} target="_blank" rel="noopener noreferrer">
                    <button className="view-link-btn">{msg.linkPolicy.text}</button>
                  </a>
                </div>
              )}

              {/* Check for contact details */}
              {msg.contact && (
                <div>
                  {msg.text && <p>{msg.text}</p>} {/* Ensure contact and text are not duplicated */}
                  <p>{msg.contact.phone}</p>
                  <p>{msg.contact.email}</p>
                  <a href="http://localhost:5173/contactus" target="_blank" rel="noopener noreferrer">
                    <button className="view-link-btn">Contact Us</button>
                  </a>
                </div>
              )}

              {/* Check if it's an image uploaded by the user */}
              {msg.image && <img src={msg.image} alt="Uploaded" className="uploaded-image-preview" />}

              {/* Check if it's a model result (image search result) */}
              {msg.result && (
                <div className="product-recommendations">
                  <h4>Image Search Result:</h4>
                  <div className="product-card">
                    {msg.result.imageUrl && (
                      <img src={msg.result.imageUrl.url} alt={msg.result.productName} className="product-image" />
                    )}
                    <p className="product-name">{msg.result.productName}</p>
                    <p className="product-price">LKR.{msg.result.price}</p>
                    <p className="product-description">
                      Color: {msg.result.color} | Size: {msg.result.size}
                    </p>
                    <div className="product-labels">
                      {msg.result.quickDelivery && <span className="product-label">Quick Delivery</span>}
                      {msg.result.discount && <span className="product-label">{msg.result.discount}</span>}
                    </div>
                    <Link to={`/product/${msg.result.productId}`}>
                      <button className="view-more-btn">View More</button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Check if it's a recommendation message */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="product-recommendations">
                  <h4>Recommended Products:</h4>
                  <div className="products-list">
                    {msg.recommendations.map((product, productIndex) => (
                      <div className="product-card" key={`product-${product.ProductId}-${productIndex}`}>
                        {product.Variations && product.Variations.length > 0 ? (
                          <>
                            <div className="product-image-wrapper">
                              <img src={product.Variations[0].image} alt={product.ProductName} className="product-image" />
                              <div className="product-labels">
                                {product.QuickDeliveryAvailable && <span className="product-label">Quick Delivery</span>}
                                {product.Discount && <span className="product-label">{product.Discount}</span>}
                              </div>
                            </div>
                            <p className="product-name">{product.ProductName}</p>
                            <p className="product-price">LKR.{product.Variations[0].price}</p>
                            <p className="product-description">
                              Color: {product.Variations[0].color} | Size: {product.Variations[0].size}
                            </p>

                            {/* Display each variation */}
                            {product.Variations.map((variation, variationIndex) => (
                              <div key={`variation-${product.ProductId}-${variationIndex}`} className="variation-info">
                              </div>
                            ))}

                            {/* View More Button to navigate to the product page */}
                            <Link to={`/product/${product.ProductId}`}>
                              <button className="view-product-btn">View More</button>
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
          ))}
        </div>

        <div className="user-query-section">
          <div className="search-bar-container">
            {/* Image preview on top of the search bar */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Selected" className="preview-image" />
                <button className="remove-image-btn" onClick={() => {
                  setImagePreview(''); 
                  setSelectedImage(null);
                }}>
                  <img src={closeIcon} alt="Remove" className="close-icon" /> {/* Use close icon */}
                </button>
              </div>
            )}

            {/* Image upload button with tooltip */}
            <label className="image-upload-btn" title="Upload your image to find similar products">
              <input type="file" accept="image/*" onChange={handleImageSelect} className="file-input" />
              <div className="upload-icon">
                <img src={upload} alt="Upload" />
              </div>
            </label>

            {/* The search input field */}
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about our products or general queries..."
              className="user-input"
              onKeyPress={handleKeyPress}
            />

            {/* Send button with search icon on the right side of the search bar */}
            <button onClick={handleSendQuery} disabled={loading} className="send-btn">
              {loading ? (
                <div className="loading"></div> // Show animation when loading
              ) : (
                <img src={search} alt="Search" className="search-icon" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>


  {/* Add Footer Component */}
  <Footer />
  </>
  );
};

export default ChatbotComponent;
