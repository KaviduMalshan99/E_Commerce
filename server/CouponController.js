const Coupon = require('./CouponModel');

// Add a new coupon
const addCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).send(coupon);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Validate a coupon
const validateCoupon = async (req, res) => {
    const { code, country } = req.body;
    try {
        const coupon = await Coupon.findOne({ code, country, isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found or not valid for your country." });
        }
        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ message: "Coupon usage limit reached." });
        }
        // Don't update the usage count here
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deactivate a coupon
const deactivateCoupon = async ({ code }) => {
    try {
        const coupon = await Coupon.findOneAndUpdate({ code }, { isActive: false }, { new: true });
        if (!coupon) {
            return { success: false, message: "Coupon not found." };
        }
        return { success: true, coupon };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get all coupons
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
};

// Delete a coupon by code
const deleteCoupon = async (req, res) => {
    const { code } = req.params;
    try {
        const coupon = await Coupon.findOneAndDelete({ code });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }
        res.status(200).json({ message: "Coupon deleted successfully." });
    } catch (error) {
        res.status (500).json({ error: 'Failed to delete coupon' });
    }
};

// Reactivate a coupon by code
const reactivateCoupon = async (req, res) => {
    const { code } = req.params;
    try {
        const coupon = await Coupon.findOneAndUpdate({ code }, { isActive: true, usageCount: 0 }, { new: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }
        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reactivate coupon' });
    }
};

module.exports = { addCoupon, validateCoupon, getAllCoupons, deactivateCoupon, deleteCoupon, reactivateCoupon };
