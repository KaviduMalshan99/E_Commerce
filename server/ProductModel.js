const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    ProductId: String,
    ProductName: String,
    Categories: [{ type: String }],
    Areas: [],
    Variations: [{
        size: String, 
        name: String, 
        count: Number, 
        images: [String], 
        price: Number 
    }],
    ImgUrls: [String],
    sizeImg:[String],
    Description: String,
    QuickDeliveryAvailable: { type: Boolean, default: false },
    DiscountPercentage:Number
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
