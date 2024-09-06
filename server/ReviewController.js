const { error } = require('server/router');
const Review = require('./ReviewModel');
const AcceptedReview = require('./AcceptedReviewModel');
const { response } = require('./app');


const addReview = (req, res, next) => {
    const {ReviewID,ReviewNum,ProductId,customerId,Date,CustomerName,CustomerEmail,Ratecount,ReviewTitle,ReviewBody,ReviewImage } = req.body;
   
    const review = new Review({
        ReviewID: ReviewID,
        ReviewNum: ReviewNum,
        ProductId: ProductId,
        Date: Date,
        customerId: customerId,
        CustomerName: CustomerName,
        CustomerEmail: CustomerEmail,
        Ratecount: Ratecount,
        ReviewTitle: ReviewTitle,
        ReviewBody: ReviewBody,
        ReviewImage: ReviewImage,
    });

    review.save()
        .then(response => {
            res.json({ response })
        })
        .catch(error => {
            res.json({ error });
        });
};

const getReview = (req, res, next) => {
    Review.find()
    .then(response => {
        res.json({response});
    })
    .catch(error =>{
        res.json({message:error})
    })
};

const getReviewById = (req, res, next) => {
    const { ReviewID } = req.params;

    Review.findOne({ ReviewID })
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ review });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const updateReview = (req, res, next) => {
    const ReviewID = req.params.ReviewID;
    const { ReviewTitle, Ratecount , ReviewBody, ReviewImage } = req.body;

    Review.findOneAndUpdate({ ReviewID:ReviewID }, { ReviewTitle, ReviewBody, ReviewImage, Ratecount}, { new: true })
        .then(updatedReview => {
            if (!updatedReview) {
                return res.json({ message: "Review not found" });
            }
            res.json({ updatedReview });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const deleteReview = (req, res, next) => {
    const { ReviewID } = req.params;

    Review.findOneAndDelete({ ReviewID })
        .then(deletedReview => {
            if (!deletedReview) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review deleted successfully" });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const acceptReview = (req, res, next) => {
    const { ReviewID } = req.params;

    // Check if the ReviewID already exists in the AcceptedReview collection
    AcceptedReview.findOne({ ReviewID })
        .then(existingAcceptedReview => {
            if (existingAcceptedReview) {
                // If the review with the same ReviewID already exists in AcceptedReview
                return res.status(400).json({ message: "Review has already been accepted" });
            }

            // Find the review in the Review collection
            Review.findOne({ ReviewID })
                .then(review => {
                    if (!review) {
                        return res.status(404).json({ message: "Review not found" });
                    }

                    // Create an AcceptedReview document based on the Review data
                    const acceptedReview = new AcceptedReview({
                        ReviewID: review.ReviewID,
                        ProductId: review.ProductId,
                        Date: review.Date,
                        customerId: review.customerId,
                        CustomerName: review.CustomerName,
                        CustomerEmail: review.CustomerEmail,
                        Ratecount: review.Ratecount,
                        ReviewTitle: review.ReviewTitle,
                        ReviewBody: review.ReviewBody,
                        ReviewImage: review.ReviewImage,
                    });

                    // Save the accepted review to the AcceptedReview collection
                    acceptedReview.save()
                        .then(savedReview => {
                            res.json({ message: "Review accepted and moved successfully" });
                        })
                        .catch(error => {
                            res.status(500).json({ error });
                        });
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};


const getacceptReview = (req, res, next) => {
    AcceptedReview.find()
    .then(response => {
        res.json({ response });
    })
    .catch(error => {
        res.json({ message: error });
    });
};


const getacceptReviewById = (req, res, next) => {
    const { ReviewID } = req.params;

    AcceptedReview.findOne({ ReviewID })
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ review });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const deleteacceptReview = (req, res, next) => {
    const { ReviewID } = req.params;

    AcceptedReview.findOneAndDelete({ ReviewID })
        .then(deletedReview => {
            if (!deletedReview) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review deleted successfully" });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const getReviewsByCustomerId = (req, res, next) => {
    const { customerId } = req.params;

    Review.find({ customerId })
        .then(reviews => {
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: "No reviews found for this customer" });
            }
            res.json({ reviews });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

const getReviewsByProductId = (req, res, next) => {
    const { productId } = req.params;

    Review.find({ ProductId: productId })
        .then(reviews => {
            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: "No reviews found for this product" });
            }
            res.json({ reviews });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};



module.exports = {
    addReview,
    getReview,
    getReviewById,
    updateReview,
    deleteReview,
    acceptReview,
    getacceptReview,
    getacceptReviewById,
    deleteacceptReview,
    getReviewsByCustomerId,
    getReviewsByProductId
    
};
