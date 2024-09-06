const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    fullName: String,
    companyName: String,
    email: String,
    contactNumber: String,
    nic: String,
    supplyproduct: String,
    city: String,
    country: String,
    nearestWarehouse: String
});

const SupplierReg = mongoose.model('SupplierReg', supplierSchema);

module.exports = SupplierReg;


