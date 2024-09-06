const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    size: {
        type: String,
        default: 'Free Size'
    },
    color: {
        type: String,
        default: 'Signature Color'
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a non-negative number']
    },
    image: {
        type: [String], // Change to array of strings to handle multiple images
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    customerId: {
        type: Number,
        required: true // Ensure customerId is required
    },
    ContactStatus: {
        type: String,
        default: "Not contacted",
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    address02: String,
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    additionalDetails: String,
    shippingMethod: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    couponCode: String,
    products: [productSchema],
    total: {
        type: Number,
        required: true,
        min: [0, 'Total must be a non-negative number']
    },
    Status: {
        type: String,
        default: 'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
