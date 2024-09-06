const mongoose = require('mongoose');

const dispatchedOrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true // Ensure orderId is unique
    },
    productId: String,
    quantity: Number
})

const DispatchedOrder = mongoose.model('DispatchedOrder', dispatchedOrderSchema);

module.exports = DispatchedOrder;
