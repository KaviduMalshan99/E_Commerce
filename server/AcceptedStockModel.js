const mongoose = require('mongoose');

const AcceptedStockSchema = new mongoose.Schema({
    supstockId: { type: String, required: true, unique: true },
    supproductId: { type: String, required: true },
    supproductnamee:{type: String, required: true},
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    stockquantity: { type: Number, required: true },
    warehousenameid: { type: String, required: true },
    acceptedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AcceptedStock', AcceptedStockSchema);
