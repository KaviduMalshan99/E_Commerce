import React, { useState, useRef, useEffect } from "react";
import "./DelayOrderInquiry.css"; // CSS for popup styling
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const DelayOrderInquiry = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the message container whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== "") {
      if (editIndex !== null) {
        // If in edit mode, update the existing message
        try {
          await axios.put(
            `http://localhost:3001/api/updateMessage/${messages[editIndex]._id}`,
            {
              message: inputText,
              sender: "12345", // Custom customer ID
            }
          );
          const newMessages = [...messages];
          newMessages[editIndex].message = inputText;
          setMessages(newMessages);
          setEditIndex(null);
        } catch (error) {
          console.error("Error updating message:", error);
        }
      } else {
        // If not in edit mode, add a new message
        try {
          const response = await axios.post(
            `http://localhost:3001/api/createMessage`,
            {
              message: inputText,
              sender: "12345", // Custom customer ID
            }
          );
          setMessages([...messages, response.data]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
      setInputText("");
    }
  };

  const handleEditMessage = (index) => {
    setEditIndex(index);
    setInputText(messages[index].message);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setInputText("");
  };

  const handleDeleteMessage = async (id, index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3001/api/deleteMessage/${id}`);
        const newMessages = [...messages];
        newMessages.splice(index, 1);
        setMessages(newMessages);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/getAllMessages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="delay-order-popup">
      <div className="delay-order-popup-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="message-container" ref={messageContainerRef}>
          {messages.map((message, index) => (
            <div
              key={message._id}
              className={`message ${
                message.sender === "12345" ? "from-customer" : "from-admin"
              }`}
            >
              {message.sender !== "12345" && (
                <div className="well-worn-label">WellWorn</div>
              )}
              <div className="message-id">
                {message.sender === "12345" && (
                  <div className="well-worn-label">{message.sender}</div>
                )}
              </div>
              <div className="message-text">
                {editIndex === index ? (
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    className="edit-mode"
                  />
                ) : (
                  message.message
                )}
              </div>
              {message.sender === "12345" && (
                <div className="message-actions">
                  {editIndex === index ? (
                    <button className="massageEdit" onClick={handleCancelEdit}>
                      {" "}
                    </button>
                  ) : (
                    <button
                      className="massageEdit"
                      onClick={() => handleEditMessage(index)}
                    ></button>
                  )}
                  <button
                    className="massageDelete"
                    onClick={() => handleDeleteMessage(message._id, index)}
                  ></button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={handleInputChange}
          />
          <button className="buttonDelayOrder" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default DelayOrderInquiry;
