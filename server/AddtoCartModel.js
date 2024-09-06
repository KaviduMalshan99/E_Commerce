const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddToCartSchema = new Schema({
    cartId: String,
    customerId: String,
    productId: String,
    name: String,
    price: Number,
    image: String,
    size: String,
    color: String,
    quantity: Number,
    availableCount: Number
});

const AddToCart = mongoose.model('AddToCart', AddToCartSchema);

module.exports = AddToCart;
