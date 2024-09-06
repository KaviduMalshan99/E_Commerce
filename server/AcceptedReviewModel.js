const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acceptedReviewSchema = new Schema({
    ReviewID: String,
    ProductId: String,
    Date: Date,
    customerId: Number,
    CustomerName: String,
    CustomerEmail: String,
    Ratecount: Number,
    ReviewTitle: String,
    ReviewBody: String,
    ReviewImage: [String],
});


const AcceptedReview = mongoose.model('AcceptedReview', acceptedReviewSchema);

module.exports = AcceptedReview;
