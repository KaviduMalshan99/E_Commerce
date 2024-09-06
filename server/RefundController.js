// // RefundController.js
// const { response } = require('./app');
// const Refund = require('./RefundModel');
// const Order = require('./OrdersModel'); // Import the Order model
// const AcceptRefund = require('./RefundAcceptModel');
// const {sendEmail} = require('./refundEmailContr');

// //const fs = require('fs');



// const getRefunds = (req, res, next) => {
//     Refund.find()
//         .then(response => {
//             res.json({ response });
//         })
//         .catch(error => {
//             res.json({ message: error});
//         });
// };

// const getRefundById = async (req, res, next) => {
//     const orderId = req.params.orderId;

//     try {
//         const refund = await Refund.findOne({ orderId: orderId });
//         if (!refund) {
//             return res.status(404).json({ error: 'Refund not found' });
//         }

//         res.json({ refund });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// // const addRefund = async (req, res, next) => {
// //   const { orderId, productId, customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

// //   try {
// //       // Check if the orderId exists in the orders table
// //       const orderExists = await Order.exists({ orderId: orderId, productId: productId });
// //       if (!orderExists) {
// //           return res.status(400).json({ error: 'Order ID does not exist' });
// //       }

// //       // If the orderId exists, proceed to add the refund
// //       const newRefund = new Refund({
// //           orderId: orderId,
// //           productId: productId,
// //           customerName: customerName,
// //           customerEmail: customerEmail,
// //           reason: reason,
// //           refundDate: refundDate,
// //           imgUrls: imgUrls
// //       });

// //       // Save the new refund
// //       const savedRefund = await newRefund.save();

// //       // Send email concurrently
// //       sendEmail(savedRefund)
// //           .then(() => {
// //               res.status(201).json({ message: "Refund added and email sent!", refund: savedRefund });
// //           })
// //           .catch(emailError => {
// //               console.error("Email send error:", emailError);
// //               res.status(201).json({ message: "Refund added but email could not be sent", refund: savedRefund });
// //           });
// //   } catch (error) {
// //       res.status(500).json({ error: error.message });
// //   }
// // };


  

// // const updateRefund = (req, res, next) => {
// //     const orderId = req.params.orderId; // Extract orderId from path parameter
// //     const { productId, customerName,  customerEmail, reason, refundDate, imgUrls } = req.body;

// //     Refund.findOneAndUpdate({ orderId: orderId }, { productId, customerName, customerEmail, reason, refundDate, imgUrls }, { new: true })
// //         .then(response => {
// //             if (!response) {
// //                 return res.status(404).json({ error: 'Refund not found' });
// //             }
// //             res.json({ response });
// //         })
// //         .catch(error => {
// //             res.json({ error });
// //         });
// // };


// // const updateRefund = (req, res, next) => {
// //     const orderId = req.params.orderId;
// //     const { customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

// //     Refund.findOneAndUpdate({ orderId: orderId }, { customerName, customerEmail, reason, refundDate, imgUrls }, { new: true })
// //         .then(response => {
// //             if (!response) {
// //                 return res.status(404).json({ error: 'Refund not found' });
// //             }
// //             res.json({ response });
// //         })
// //         .catch(error => {
// //             res.json({ error });
// //         });
// // };


// const addRefund = async (req, res, next) => {
//     const { orderId, id, customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

//     try {
//         // Check if the orderId exists in the orders table
//         const orderExists = await Order.exists({ orderId: orderId, id: id });
//         if (!orderExists) {
//             return res.status(400).json({ error: 'Order ID does not exist' });
//         }

//         // If the orderId exists, proceed to add the refund
//         const newRefund = new Refund({
//             orderId: orderId,
//             id: id,
//             customerName: customerName,
//             customerEmail: customerEmail,
//             reason: reason,
//             refundDate: refundDate,
//             imgUrls: imgUrls
//         });

//         // Save the new refund
//         const savedRefund = await newRefund.save();

//         res.status(201).json({ message: "Refund added!", refund: savedRefund });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const updateRefund = async (req, res, next) => {
//     const orderId = req.params.orderId; // Extract orderId from path parameter
//     const { id, customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

//     try {
//         const updatedRefund = await Refund.findOneAndUpdate(
//             { orderId: orderId },
//             { id, customerName, customerEmail, reason, refundDate, imgUrls },
//             { new: true }
//         );

//         if (!updatedRefund) {
//             return res.status(404).json({ error: 'Refund not found' });
//         }

//         // Send email
//         sendEmail(updatedRefund)
//             .then(() => {
//                 res.json({ message: 'Refund updated and email sent!', refund: updatedRefund });
//             })
//             .catch(emailError => {
//                 console.error("Email send error:", emailError);
//                 res.json({ message: 'Refund updated but email could not be sent', refund: updatedRefund });
//             });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



// // const updateRefund = (req, res, next) => {
// //     const orderId = req.params.orderId;
// //     const { customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

// //     // Update the refund details
// //     Refund.findOneAndUpdate(
// //         { orderId: orderId },
// //         { $set: { customerName: customerName }},
// //         { $set: { customerEmail: customerEmail }},
// //         { $set: { reason: reason }},
// //         { $set: { refundDate: refundDate }},
// //         { $set: { imgUrls: imgUrls }},
// //         { new: true } // Return the updated document


// //     )

// //         .then(response => {
// //             res.json({ response });
// //         })
// //         .catch(error => {
// //             res.json({ error });
// //         })
// // };



// const deleteRefund = ( req, res, next) => {
//     const orderId = req.params.id;

//     Refund.deleteOne({orderId: orderId })
//         .then(response => {
//             res.json({ response });
//         })
//         .catch(error => {
//             res.json({ error });
//         });
// };


// const approveRefund = async (req, res, next) => {
//     const orderId = req.params.orderId;
  
//     try {
//       const refund = await Refund.findOne({ orderId: orderId });
//       if (!refund) {
//         return res.status(404).json({ error: 'Refund not found' });
//       }
  
//       // Create a new record in the acceptrefunds collection
//       const acceptedRefund = new AcceptRefund(refund.toObject());
//       await acceptedRefund.save();
  
//       // Delete the record from the refunds collection
//       await Refund.deleteOne({ orderId: orderId });
  
//       res.json({ message: 'Refund approved and moved to accepted refunds' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };



//   const getAcceptedRefunds = (req, res, next) => {
//     AcceptRefund.find()
//       .then(response => {
//         res.json({ response });
//       })
//       .catch(error => {
//         res.status(500).json({ error: error.message });
//       });
//   };


//   const deleteAccRefund = ( req, res, next) => {
//     const orderId = req.params.id;

//     AcceptRefund.deleteOne({orderId: orderId })
//         .then(response => {
//             res.json({ response });
//         })
//         .catch(error => {
//             res.json({ error });
//         });
// };

// module.exports = { getRefunds, getRefundById, addRefund, deleteRefund, updateRefund, approveRefund, getAcceptedRefunds, deleteAccRefund };





const { response } = require('./app');
const Refund = require('./RefundModel');
const Order = require('./OrdersModel'); // Import the Order model
const AcceptRefund = require('./RefundAcceptModel');
const {sendEmail} = require('./refundEmailContr');

const getRefunds = (req, res, next) => {
    Refund.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ message: error });
        });
};

const getRefundById = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const refund = await Refund.findOne({ orderId: orderId });
        if (!refund) {
            return res.status(404).json({ error: 'Refund not found' });
        }

        res.json({ refund });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addRefund = async (req, res, next) => {
    const { orderId, productIds, customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

    try {
        // Check if the orderId exists in the orders table
        const order = await Order.findOne({ orderId: orderId });
        if (!order) {
            return res.status(400).json({ error: 'Order ID does not exist' });
        }

        // Check if all productIds are part of the order's products
        const invalidProductIds = productIds.filter(productId => 
            !order.products.some(product => product.productId === productId)
        );

        if (invalidProductIds.length > 0) {
            return res.status(400).json({ error: `Invalid product IDs: ${invalidProductIds.join(', ')}` });
        }

        // If the orderId exists and productIds are valid, proceed to add the refund
        const newRefund = new Refund({
            orderId: orderId,
            productIds: productIds,
            customerName: customerName,
            customerEmail: customerEmail,
            reason: reason,
            refundDate: refundDate,
            imgUrls: imgUrls
        });

        // Save the new refund
        const savedRefund = await newRefund.save();

        res.status(201).json({ message: "Refund added!", refund: savedRefund });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRefund = async (req, res, next) => {
    const orderId = req.params.orderId; // Extract orderId from path parameter
    const { productIds, customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

    try {
        const updatedRefund = await Refund.findOneAndUpdate(
            { orderId: orderId },
            { productIds, customerName, customerEmail, reason, refundDate, imgUrls },
            { new: true }
        );

        if (!updatedRefund) {
            return res.status(404).json({ error: 'Refund not found' });
        }

        // Send email
        sendEmail(updatedRefund)
            .then(() => {
                res.json({ message: 'Refund updated and email sent!', refund: updatedRefund });
            })
            .catch(emailError => {
                console.error("Email send error:", emailError);
                res.json({ message: 'Refund updated but email could not be sent', refund: updatedRefund });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const deleteRefund = (req, res, next) => {
    const orderId = req.params.id;

    Refund.deleteOne({ orderId: orderId })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const approveRefund = async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      const refund = await Refund.findOne({ orderId: orderId });
      if (!refund) {
        return res.status(404).json({ error: 'Refund not found' });
      }
  
      // Create a new document in the AcceptRefund collection
      const acceptRefund = new AcceptRefund({
        orderId: refund.orderId,
        productIds: refund.productIds,
        customerName: refund.customerName,
        customerEmail: refund.customerEmail,
        reason: refund.reason,
        refundDate: refund.refundDate,
        imgUrls: refund.imgUrls
      });
  
      await acceptRefund.save();
      await Refund.deleteOne({ orderId: orderId });
  
      res.status(201).json({ message: 'Refund approved and moved to accepted refunds!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


const getAcceptedRefunds = (req, res, next) => {
    AcceptRefund.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const deleteAccRefund = (req, res, next) => {
    const orderId = req.params.id;

    AcceptRefund.deleteOne({ orderId: orderId })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

module.exports = { getRefunds, getRefundById, addRefund, deleteRefund, updateRefund, approveRefund, getAcceptedRefunds, deleteAccRefund };
