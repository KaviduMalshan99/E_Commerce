const mongoose = require('mongoose');

const ProductStockSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  sizes: [String],
  colors: [String],
  warehouseId: String,
  stockquantity: Number,
  accepted: { type: Boolean, default: false }  // Default to false
});

module.exports = mongoose.model('ProductStock', ProductStockSchema);
