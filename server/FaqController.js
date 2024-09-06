const Faq = require('./FaqModel');
const { response } = require('./app');

const addFaq = (req, res, next) => {
    const { FaqID,Date,CustomerName,CustomerEmail,Question } = req.body;

    const faq = new Faq ({
        FaqID: FaqID,
        Date: Date,
        CustomerName: CustomerName,
        CustomerEmail: CustomerEmail,
        Question: Question,
    })

    faq.save()
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            res.json({error})
        });
};

// const getFaq = (req, res, next) => {
//     const { FaqID } = req.params;

//     Faq.findOne({ FaqID })
//         .then(faq => {
//             if (!faq) {
//                 return res.status(404).json({ message: "FAQ not found" });
//             }
//             res.json({ faq });
//         })
//         .catch(error => {
//             res.status(500).json({ error });
//         });
// };

const getFaq = (req, res, next) => {

    Faq.find()
        .then(response => {
                res.json({ response});
        })
        .catch(error => {
            res.json({ error });
        });
};


const deleteFaq = (req, res, next) => {
    const FaqID = req.params.FaqID;

    Faq.deleteOne({FaqID: FaqID})
        .then(response => {
            res.json({response});
        })
        .catch(error => {
            res.json({ error })
        });
};

// const getFaqById = (req, res, next) => {
//     const { FaqId } = req.params.FaqID; // Assuming faqId is passed as a parameter

//     Faq.findOne({ FaqID: FaqId })
//         .then(faq => {
//             if (!Faq) {
//                 return res.status(404).json({ message: "FAQ not found" });
//             }
//             res.json({ faq });
//         })
//         .catch(error => {
//             res.status(500).json({ error });
//         });
// };

const getFaqById = (req, res, next) => {
    const { FaqID } = req.params; // Adjusted to destructure FaqID correctly

    Faq.findOne({ FaqID })
        .then(faq => {
            if (!faq) {
                return res.status(404).json({ message: "FAQ not found" });
            }
            res.json({ faq });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// const deleteFaq = (req, res, next) => {
//     const { id } = req.params;

//     Faq.findByIdAndDelete(id)
//         .then(response => {
//             if (!response) {
//                 return res.status(404).json({ message: "FAQ not found" });
//             }
//             res.json({ message: "FAQ deleted successfully" });
//         })
//         .catch(error => {
//             res.status(500).json({ error });
//         });
// };

module.exports = {
    addFaq,
    getFaq,
    deleteFaq,
    getFaqById
};
