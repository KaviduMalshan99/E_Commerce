const { response } = require('express');
const Order = require('./OrdersModel');
const Coupon = require('./CouponModel');
const { sendEmail } = require('../server/util/email_templates/orderStatusEmailTemplate');
const { sendEmaill } = require('../server/utilities/emailUtility');

function generateOrderId() {
    const prefix = 'OID';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return prefix + randomNum.toString();
}

const getOrders = (req, res, next) => {
    Order.find()
        .then(orders => res.json({ orders }))
        .catch(error => res.status(500).json({ error: error.message }));
};

const addOrder = async (req, res, next) => {
    const {
        customerId, // Ensure customerId is handled
        country,
        email,
        firstName,
        lastName,
        contactNumber,
        State,
        address,
        address02,
        city,
        postalCode,
        additionalDetails,
        shippingMethod,
        paymentMethod,
        couponCode,
        items, // items can be a single product or an array of products
        total,
        Status,
        ContactStatus
    } = req.body;

    console.log("Received order data:", req.body); // Add logging to see the incoming request

    const orderId = generateOrderId();
    const offset = 5.5;
    const orderDate = new Date(new Date().getTime() + offset * 3600 * 1000);

    // Ensure products is always an array and handle image field correctly
    const products = Array.isArray(items) ? items.map(item => ({
        ...item,
        image: Array.isArray(item.image) ? item.image.join(',') : item.image || '' // Handle image appropriately
    })) : [{
        ...items,
        image: Array.isArray(items.image) ? items.image.join(',') : items.image || '' // Handle image appropriately
    }];

    const order = new Order({
        orderId,
        orderDate,
        customerId, // Save customerId in the order
        country,
        email,
        firstName,
        lastName,
        contactNumber,
        State,
        address,
        address02,
        city,
        postalCode,
        additionalDetails,
        shippingMethod,
        paymentMethod,
        couponCode,
        products, // Use the array ensured above
        total,
        Status,
        ContactStatus
    });

    try {
        const savedOrder = await order.save();

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode });
            if (coupon) {
                coupon.usageCount += 1;
                if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
                    coupon.isActive = false;
                }
                await coupon.save();
            }
        }

        try {
            await sendEmaill(savedOrder.toObject());
            res.status(201).json({ message: "Order placed and email sent!", order: savedOrder });
        } catch (emailError) {
            console.error("Email send error:", emailError);
            res.status(201).json({ message: "Order placed but email could not be sent", order: savedOrder });
        }
    } catch (error) {
        console.error("Database save error:", error);
        res.status(500).json({ error: "Failed to save order", details: error.toString() });
    }
};

const updateOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    const updates = req.body;

    Order.findByIdAndUpdate(orderId, updates, { new: true })
        .then(updatedOrder => res.json({ updatedOrder }))
        .catch(error => res.status(500).json({ error: error.message }));
};

const updateContactStatus = async (req, res) => {
    const { orderId } = req.params;
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },
            { $set: { ContactStatus: "Informed" } },
            { new: true }
        );
        if (updatedOrder) {
            res.json({ success: true, message: "Contact status updated successfully", data: updatedOrder });
        } else {
            res.status(404).json({ success: false, message: "Order not found" });
        }
    } catch (error) {
        console.error("Error updating contact status:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const updateResult = await Order.findOneAndUpdate(
            { orderId },
            { $set: { Status: "Dispatched" } },
            { new: true }
        );

        if (updateResult) {
            res.json({ success: true, message: "Order status updated successfully", data: updateResult });
        } else {
            res.status(404).json({ success: false, message: "Order not found" });
        }
    } catch (error) {
        console.error("Order status update failed:", error.message);
        res.status(500).json({ error });
    }
};

const sendOrderStatusEmail = async (req, res, next) => {
    try {
        const { toName, orderId, productName, Status, email } = req.body;

        const emailTemplate = orderStatusEmailTemplate(
            toName,
            orderId,
            productName,
            Status
        );
        sendEmail(email, "Order Status Update", emailTemplate);

        await Order.findOneAndUpdate(
            { orderId: orderId },
            { $set: { ContactStatus: "Informed" } },
            { new: true }
        );

        res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        res.json({ error });
    }
};

const deleteOrder = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.deleteOne({ orderId })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Order deleted successfully' });
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        })
        .catch(error => res.status(500).json({ error: 'Internal Server error' }));
};

const getOrderById = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrdersByCustomerId = async (req, res) => {
    const { customerId } = req.params;
    try {
        const orders = await Order.find({ customerId }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status (500).json({ error: error.message });
    }
};

module.exports = { getOrders, addOrder, updateOrder, deleteOrder, getOrderById, updateContactStatus, sendOrderStatusEmail, updateOrderStatus, getOrdersByCustomerId };
