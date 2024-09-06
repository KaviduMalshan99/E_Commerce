const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
    methodName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);

module.exports = ShippingMethod;
