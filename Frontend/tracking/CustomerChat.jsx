// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './CustomerChat.css'; // CSS file for Customer Chat

// const CustomerChat = () => {
//   const customerId = '12345'; // Hardcoded customer ID, update with actual customer ID
//   const [orderIds, setOrderIds] = useState([]);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [searchInput, setSearchInput] = useState('');

//   useEffect(() => {
//     const fetchOrderIds = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/api/getOrderIds');
//         setOrderIds(response.data);
//       } catch (error) {
//         console.error('Error fetching order IDs:', error);
//       }
//     };

//     fetchOrderIds();
//   }, []);

//   const handleSelectOrder = async (orderId) => {
//     setSelectedOrderId(orderId);
//     try {
//       const response = await axios.get(`http://localhost:3001/api/getMessagesByOrderId/${orderId}`);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (inputText.trim() !== '') {
//       if (editingMessageId !== null) {
//         // If in edit mode, update the existing message
//         try {
//           await axios.put(`http://localhost:3001/api/updateMessage/${editingMessageId}`, {
//             message: inputText,
//             sender: customerId
//           });
//           const updatedMessages = messages.map(msg =>
//             msg._id === editingMessageId ? { ...msg, message: inputText } : msg
//           );
//           setMessages(updatedMessages);
//           setEditingMessageId(null);
//         } catch (error) {
//           console.error('Error updating message:', error);
//         }
//       } else {
//         // If not in edit mode, add a new message
//         try {
//           const response = await axios.post('http://localhost:3001/api/createMessage', {
//             message: inputText,
//             sender: customerId
//           });
//           setMessages([...messages, response.data]);
//         } catch (error) {
//           console.error('Error sending message:', error);
//         }
//       }
//       setInputText('');
//     }
//   };

//   const handleEditMessage = (messageId, initialMessage) => {
//     setEditingMessageId(messageId);
//     setInputText(initialMessage);
//   };

//   const handleCancelEdit = () => {
//     setEditingMessageId(null);
//     setInputText('');
//   };

//   const handleDeleteMessage = async (messageId) => {
//     try {
//       const message = messages.find(msg => msg._id === messageId);
//       if (message && message.sender === customerId) {
//         await axios.delete(`http://localhost:3001/api/deleteMessage/${messageId}`);
//         const filteredMessages = messages.filter(msg => msg._id !== messageId);
//         setMessages(filteredMessages);
//       } else {
//         console.warn('You cannot delete messages from WellWorn.');
//       }
//     } catch (error) {
//       console.error('Error deleting message:', error);
//     }
//   };

//   const filteredOrderIds = orderIds.filter(orderId =>
//     orderId.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   return (
//     <div>
//       <div className='chatOrderIdSearch'>
//         <h1>Delay Order Query List</h1>
//         <div className="chatOrderIdsearch-bar">
//           <input
//             type="text"
//             placeholder="Search by Order ID..."
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//           />
//           <button >
//           <i className="fas fa-search" />
//         </button>
//         </div>
//       </div>
//       <div className='CustomerChat'>
//         <div className="order-list">
//           <h2>Order ID List</h2>
//           <div className="order-scroll">
//             {filteredOrderIds.map((orderId) => (
//               <div key={orderId} className="order-card" onClick={() => handleSelectOrder(orderId)}>
//                 {orderId}
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="chat-box">
//           {selectedOrderId && (
//             <>
//               <h2>Chat for Order ID: {selectedOrderId}</h2>
//               <div className="message-container">
//                 {messages.map((message) => (
//                   <div
//                     key={message._id}
//                     className={`message ${message.sender === customerId ? 'customer-message' : 'admin-message'}`}
//                   >
//                     <div className="message-sender">
//                       {message.sender === customerId ? (
//                         <p><strong>{customerId}</strong></p>
//                       ) : (
//                         <p><strong>WellWorn</strong></p>
//                       )}
//                     </div>
//                     <div className="message-content">
//                       {editingMessageId === message._id ? (
//                         <input
//                           className='edit-message'
//                           type="text"
//                           value={inputText}
//                           onChange={(e) => setInputText(e.target.value)}
//                           placeholder="Edit message..."
//                         />
//                       ) : (
//                         <p>{message.message}</p>
//                       )}
//                     </div>
//                     <div className="message-actions">
//                       {message.sender === customerId && (
//                         <>
//                           {!editingMessageId ? (
//                             <button className='massageEdit' onClick={() => handleEditMessage(message._id, message.message)}></button>
//                           ) : (
//                             <button className='massageEdit' onClick={handleCancelEdit}></button>
//                           )}
//                           <button className='massageDelete' onClick={() => handleDeleteMessage(message._id)}></button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="input-container">
//                 <input
//                   type="text"
//                   placeholder="Type your message..."
//                   value={inputText}
//                   onChange={(e) => setInputText(e.target.value)}
//                 />
//                 <button onClick={handleSendMessage}>Send</button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerChat;
