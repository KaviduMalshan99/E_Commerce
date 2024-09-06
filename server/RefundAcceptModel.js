const mongoose = require('mongoose');

const acceptRefundSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  productIds: {
    type: [String],
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  refundDate: {
    type: Date,
    required: true
  },
  imgUrls: {
    type: [String],
    required: false
  }
});

const AcceptRefund = mongoose.model('refundAccept', acceptRefundSchema); // Update model name as needed

module.exports = AcceptRefund;
