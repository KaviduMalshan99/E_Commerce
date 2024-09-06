const ShippingMethod = require('./ShippingMethodModel');

exports.addShippingMethod = async (req, res) => {
    try {
        const { methodName, price, country } = req.body;
        const newMethod = new ShippingMethod({ methodName, price, country });
        await newMethod.save();
        res.status(201).json(newMethod);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShippingMethods = async (req, res) => {
    try {
        const { country } = req.query;
        const methods = country 
            ? await ShippingMethod.find({ country }) 
            : await ShippingMethod.find();
        res.json(methods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateShippingMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const { methodName, price, country } = req.body;
        const updatedMethod = await ShippingMethod.findByIdAndUpdate(id, { methodName, price, country }, { new: true });
        if (!updatedMethod) return res.status(404).json({ error: 'Shipping method not found' });
        res.json(updatedMethod);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteShippingMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMethod = await ShippingMethod.findByIdAndDelete(id);
        if (!deletedMethod) return res.status(404).json({ error: 'Shipping method not found' });
        res.json({ message: 'Shipping method deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
