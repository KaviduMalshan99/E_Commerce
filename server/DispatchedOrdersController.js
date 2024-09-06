const DispatchedOrder = require('./DispatchedOrdersModel');

exports.createDispatchedOrder = async (req, res) => {
  const { orderId, productId, quantity } = req.body;
  try {
    const newDispatchedOrder = new DispatchedOrder({
      orderId,
      productId,
      quantity
    });

    await newDispatchedOrder.save();
    res.status(201).json({
      success: true,
      message: 'Dispatched order saved successfully',
      dispatchedOrder: newDispatchedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save dispatched order',
      error: error.message
    });
  }
};


exports.deleteAllDispatchedOrders = async (req, res) => {
  try {
      await DispatchedOrder.deleteMany({});
      res.status(200).json({ success: true, message: 'All dispatched orders have been deleted' });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete dispatched orders', error: error.message });
  }
};