const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: String // Assuming an order ID field is added to messages
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
