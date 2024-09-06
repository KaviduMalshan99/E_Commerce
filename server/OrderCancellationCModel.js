const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderCancellationSchema = new Schema({
    OrderID: String,
    titleForCancellation: String,
    reasonForCancellation: String,
    id: String,

    cancellationDate: {
        type: Date,
        default: Date.now // Set default value to current date/time when not provided
    }
});

const OrderCancellation = mongoose.model('OrderCancellation', OrderCancellationSchema);

module.exports = OrderCancellation;
