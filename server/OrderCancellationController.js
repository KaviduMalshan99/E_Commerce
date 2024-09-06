const AddOrderCancellation = require('./OrderCancellationCModel');
const Order = require('./OrdersModel'); // Import Order model

const getOrderCancellation = (req, res, next) => {
    AddOrderCancellation.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.status(500).json({ message: error.message });
        });
};

const addOrderCancellation = async (req, res, next) => {
    const { OrderID, titleForCancellation, reasonForCancellation } = req.body;

    try {
        const order = await Order.findOne({ orderId: OrderID });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const id = order.id; // Correctly get productId from the order

        const orderCancellation = new AddOrderCancellation({
            OrderID: OrderID,
            titleForCancellation: titleForCancellation,
            reasonForCancellation: reasonForCancellation,
            cancellationDate: new Date(), // Automatically set the current date/time
            id: id // Save productId with the cancellation record
        });

        const savedCancellation = await orderCancellation.save();
        res.status(201).json({ response: savedCancellation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// const addOrderCancellation = (req, res, next) => {
//     const { OrderID, titleForCancellation, reasonForCancellation ,cancellationDate} = req.body;

//     const orderCancellation = new AddOrderCancellation({
//         OrderID: OrderID,
//         titleForCancellation: titleForCancellation,
//         reasonForCancellation: reasonForCancellation,
//         cancellationDate:cancellationDate
//     });

//     orderCancellation.save()
//         .then(response => {
//             res.status(201).json({ response });
//         })
//         .catch(error => {
//             res.status(500).json({ error: error.message });
//         });
// };

const deleteOrderCancellation = (req, res, next) => {
    const OrderID = req.params.OrderID; // Retrieve OrderID from URL params

    AddOrderCancellation.deleteOne({ OrderID: OrderID })
        .then(response => {
            if (response.deletedCount === 1) {
                res.json({ message: 'Order cancellation deleted successfully' });
            } else {
                res.status(404).json({ message: 'Order cancellation not found' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

module.exports = { addOrderCancellation, getOrderCancellation, deleteOrderCancellation };
