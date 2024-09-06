const Notification = require('./NotificationModel');

// Create or update a notification, ensuring no duplicates
exports.createOrUpdateNotification = async (req, res) => {
  const { warehouseId, productId, stockQty, message } = req.body;

  // Validate required fields
  if (!warehouseId || !productId || stockQty === undefined || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check for existing low-stock notification
    const existingNotification = await Notification.findOne({
      warehouseId,
      productId
    });

    // Update existing notification if already present
    if (existingNotification) {
      existingNotification.stockQty = stockQty;
      existingNotification.message = message;
      await existingNotification.save();
      return res.status(200).json({
        message: 'Notification updated',
        notification: existingNotification
      });
    }

    // Create new notification if it doesn't exist
    const newNotification = new Notification({
      warehouseId,
      productId,
      stockQty,
      message
    });
    await newNotification.save();
    res.status(201).json({
      message: 'Notification created',
      notification: newNotification
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Fetch all notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
