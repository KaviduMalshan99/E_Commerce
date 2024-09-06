import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
    const [userMessage, setUserMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    const handleSendMessage = async () => {
        if (userMessage.trim() === "") return;

        try {
            const response = await axios.post("http://localhost:3001/api/chatbot", { message: userMessage });
            setChatMessages([
                ...chatMessages,
                { sender: "user", message: userMessage },
                { sender: "bot", message: response.data.reply },
            ]);
        } catch (error) {
            console.error("Error sending message to chatbot:", error);
        }

        setUserMessage("");
    };

    return (
        <div className="chatbot-container">
            <div className="chatbox">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={msg.sender === "user" ? "user-message" : "bot-message"}>
                        {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask for product recommendations..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;
