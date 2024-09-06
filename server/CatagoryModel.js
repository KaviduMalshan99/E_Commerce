const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    CatagoryId: String,
    CatagoryName: String
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
