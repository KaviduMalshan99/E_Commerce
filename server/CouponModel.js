const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'NUMBER'], required: true },
    discountValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    country: { type: String, required: true },
    currency: { type: String, required: true },
    usageLimit: { type: Number, default: 1 }, // New field for usage limit
    usageCount: { type: Number, default: 0 }  // New field for usage count
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
