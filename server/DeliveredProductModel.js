const mongoose = require('mongoose');

const DeliveredProductSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  estimatedDate: {
    type: Date,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  firstStateDate: {
    type: Date,
    required: true
  },
  secondStateDate: {
    type: Date,
    required: true
  },
  thirdStateDate: {
    type: Date,
    required: true
  },
  fourthStateDate: {
    type: Date,
    required: true
  },
  fifthStateDate: {
    type: Date,
    required: true
  },
  sixthStateDate: {
    type: Date,
    required: true
  }
});

const DeliveredProduct = mongoose.model('DeliveredProduct', DeliveredProductSchema);

module.exports = DeliveredProduct;
