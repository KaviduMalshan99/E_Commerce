const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    StocksupplierName: String,
    supproductId: String,
    supproductnamee:String,
    supstockId: {
        type: String,
        unique: true 
    },
    stockPrice: String,
    supplyDate: Date,
    stockquantity: String,
    warehousenameid: String,
    sizes: [String], 
    colors: [String]               
});


// Middleware to generate supstockId before saving
stockSchema.pre('save', function(next) {
    // Reference to the current document being saved
    const stock = this;
    
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    
    stock.supstockId = `STK0${randomNum}`;
    next();
});

const SupplierStock = mongoose.model('SupplierStock', stockSchema);

module.exports = SupplierStock;






