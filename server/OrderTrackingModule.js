const mongoose = require('mongoose');

const OrderTrackingSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  estimatedDate: {
    type: Date,
    default: function() {
      const thirtyDaysLater = new Date(this.orderDate);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      return thirtyDaysLater;
    }
  },
  country: {
    type: String,
    required: true
  },
  firstStateDate: {
    type: Date
  },
  secondStateDate: {
    type: Date
  },
  thirdStateDate: {
    type: Date
  },
  fourthStateDate: {
    type: Date
  },
  fifthStateDate: {
    type: Date
  },
  sixthStateDate: {
    type: Date
  }
});

const OrderTracking = mongoose.model('OrderTracking', OrderTrackingSchema);

module.exports = OrderTracking;
