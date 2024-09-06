const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  warehouseId: { type: String, required: true },
  productId: { type: String, required: true },
  stockQty: { type: Number, required: true },
  message: { type: String, required: true }
}, {
  timestamps: true
});

// Ensure unique combination of warehouseId and productId
NotificationSchema.index({ warehouseId: 1, productId: 1 }, { unique: true });

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
