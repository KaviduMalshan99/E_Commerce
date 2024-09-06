const Order = require('./OrdersModel');
const OrderTracking = require('./OrderTrackingModel');
const DeliveredProduct = require('./DeliveredProductModel');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');  // Add this line to import mongoose


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nirmalsubashana3@gmail.com',
    pass: 'xibv nzlv izdg unem'
  }
});

const sendNotification = async (orderId, status) => {
  try {
    // const order = await Order.findById(orderId);
    const order = await Order.findOne({ orderId });  // Adjust this to find by orderId field


    if (!order) {
      console.error('Order not found');
      return;
    }

    // Get the current date and time
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });

    const mailOptions = {
      from: '"WellWorn Private Limited" <nirmalsubashana3@gmail.com>',
      to: order.email,
      subject: `Order ${orderId} Status Update`,
      html: `
        <p>Your order status has been updated to: <strong>${status}</strong> on <strong>${formattedDate}</strong></p>
        <p>Please note that your order is now being processed and will be shipped to the provided address within the estimated delivery time frame. 
        You will receive a separate email with tracking information once your order has been dispatched.</p>
        <p>If you have any questions or require further assistance, feel free to contact us at wellworn@gmail.com or reply directly to this email.</p>
        <p>Thank you once again for your purchase. We appreciate your business and look forward to serving you again in the future.</p>
        <p>Warm regards,</p>
        <p>WellWorn Private Limited<br> `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Notification sent');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};


const addTrackingEntry = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    let trackingEntry = await OrderTracking.findOne({ orderId });
    if (!trackingEntry) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      const { orderDate, country } = order;
      const firstStateDate = new Date();
      trackingEntry = new OrderTracking({
        orderId,
        orderDate,
        estimatedDate: new Date(firstStateDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        country,
        firstStateDate,
        secondStateDate: new Date(firstStateDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        thirdStateDate: new Date(firstStateDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        fourthStateDate: null,
        fifthStateDate: null,
        sixthStateDate: null
      });
      await trackingEntry.save();

      if (firstStateDate) {
        await sendNotification(orderId, 'Dispatch from Overseas');
      }
    }
    res.json({ trackingEntry });
  } catch (error) {
    console.error('Error creating tracking entry:', error);
    res.status(500).json({ error: 'Error creating tracking entry' });
  }
};

// Controller function to add a tracking entry
// const addTrackingEntry = async (req, res) => {
//   const { orderId, orderDate, estimatedDate, country, firstStateDate, secondStateDate, thirdStateDate, fourthStateDate, fifthStateDate, sixthStateDate } = req.body;

//   try {
//     const newEntry = new OrderTracking({ orderId, orderDate, estimatedDate, country, firstStateDate, secondStateDate, thirdStateDate, fourthStateDate, fifthStateDate, sixthStateDate });
//     await newEntry.save();

//     if (firstStateDate) {
//       await sendNotification(orderId, 'Dispatch from CN Warehouse');
//     }

//     res.status(201).json(newEntry);
//   } catch (error) {
//     console.error('Error creating tracking entry:', error);
//     res.status(500).json({ error: 'An error occurred while creating tracking entry' });
//   }
// };

// const updateTrackingStatus = async (req, res) => {
//   const { orderId } = req.params; // Extract orderId from URL
//   const { status } = req.body;

//   try {
//     const currentDate = new Date();
//     let trackingEntry = await OrderTracking.findOne({ orderId });

//     if (!trackingEntry) {
//       return res.status(404).json({ error: 'Tracking entry not found' });
//     }

//     // Update the appropriate date field based on status
//     switch (status) {
//       case 'Arrival in Custom':
//         trackingEntry.fourthStateDate = currentDate;
//         break;
//         case 'Courier Selected':
//             trackingEntry.fifthStateDate = currentDate;
//             break;
//         case 'Delivered':
//             trackingEntry.sixthStateDate = currentDate;

//               // Save to DeliveredProducts collection
//         const deliveredProduct = new DeliveredProduct({
//           orderId: trackingEntry.orderId,
//           orderDate: trackingEntry.orderDate,
//           estimatedDate: trackingEntry.estimatedDate,
//           country: trackingEntry.country,
//           firstStateDate: trackingEntry.firstStateDate,
//           secondStateDate: trackingEntry.secondStateDate,
//           thirdStateDate: trackingEntry.thirdStateDate,
//           fourthStateDate: trackingEntry.fourthStateDate,
//           fifthStateDate: trackingEntry.fifthStateDate,
//           sixthStateDate: currentDate
//         });
//         await deliveredProduct.save();

//             break;
//         default:
//              break;

      
//     }

//     await trackingEntry.save();
//     res.json({ message: 'Tracking status updated successfully' });
//   } catch (error) {
//     console.error('Error updating tracking status:', error);
//     res.status(500).json({ error: 'Error updating tracking status' });
//   }
// };

// Controller function to update tracking status
const updateTrackingStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const trackingEntry = await OrderTracking.findOne({ orderId });

    if (!trackingEntry) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    if (status === 'Dispatch from Overseas') {
      trackingEntry.firstStateDate = new Date();
      trackingEntry.secondStateDate = new Date(trackingEntry.firstStateDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      trackingEntry.thirdStateDate = new Date(trackingEntry.firstStateDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    } else if (status === 'Arrival in Custom') {
      // Check if secondStateDate and thirdStateDate are in future
      const currentDate = new Date();
      if (trackingEntry.secondStateDate > currentDate) {
        trackingEntry.secondStateDate = currentDate;
      }
      if (trackingEntry.thirdStateDate > currentDate) {
        trackingEntry.thirdStateDate = currentDate;
      }
      trackingEntry.fourthStateDate = new Date();
    } else if (status === 'Hand Over to Courier') {
      trackingEntry.fifthStateDate = new Date();
    } else if (status === 'Delivered') {
      trackingEntry.sixthStateDate = new Date();
      await DeliveredProduct.create({ ...trackingEntry.toObject(), deliveredDate: new Date() });
    }

    await trackingEntry.save();
    await sendNotification(orderId, status);

    res.json(trackingEntry);
  } catch (error) {
    console.error('Error updating tracking status:', error);
    res.status(500).json({ error: 'An error occurred while updating tracking status' });
  }
};

// Function to get tracking details for a specific order ID
const getTrackingDetails = async (req, res) => {
  try {
    const trackingEntries = await OrderTracking.find();

    if (!trackingEntries || trackingEntries.length === 0) {
      return res.status(404).json({ error: 'No tracking entries found' });
    }

    res.json({ trackingEntries });
  } catch (error) {
    console.error('Error fetching tracking details:', error);
    res.status(500).json({ error: 'Error fetching tracking details' });
  }
};


// Function to get tracking details for a specific order ID
const getTrackingByOrderId = async (req, res) => {
  const { orderId, producId } = req.params;

  try {
    const trackingEntry = await OrderTracking.findOne({ orderId, producId });

    if (!trackingEntry) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    res.status(200).json({ trackingEntry });
  } catch (error) {
    console.error('Error fetching tracking information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to delete tracking details for a specific order ID
const deleteTrackingDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedEntry = await OrderTracking.deleteOne({ orderId });

    if (deletedEntry.deletedCount === 0) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    res.json({ message: 'Tracking entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tracking entry:', error);
    res.status(500).json({ error: 'Error deleting tracking entry' });
  }
};

const deleteDeliverProducts = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedEntry = await DeliveredProduct.deleteOne({ orderId });

    if (deletedEntry.deletedCount === 0) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    res.json({ message: 'Tracking entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tracking entry:', error);
    res.status(500).json({ error: 'Error deleting tracking entry' });
  }
};

// Function to get all delivered products
const getDeliveredProducts = async (req, res) => {
  try {
    const deliveredProducts = await DeliveredProduct.find();

    if (!deliveredProducts || deliveredProducts.length === 0) {
      return res.status(404).json({ error: 'No delivered products found' });
    }

    res.json({ deliveredProducts });
  } catch (error) {
    console.error('Error fetching delivered products:', error);
    res.status(500).json({ error: 'Error fetching delivered products' });
  }
};


const reverseStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const trackingEntry = await OrderTracking.findOne({ orderId });
    if (!trackingEntry) {
      return res.status(404).json({ message: 'Tracking entry not found' });
    }

    // Check if the current state is "Air Fred Company" and prevent reversal
    if (trackingEntry.fourthStateDate && !trackingEntry.fifthStateDate) {
      return res.status(400).json({ message: 'Cannot revert from Arrival in Custom state' });
    }
    if (trackingEntry.sixthStateDate) {
      return res.status(400).json({ message: 'Cannot revert from Arrival in Custom state' });
    }

    if (trackingEntry.sixthStateDate) {
      trackingEntry.sixthStateDate = null;
    } else if (trackingEntry.fifthStateDate) {
      trackingEntry.fifthStateDate = null;
    } else if (trackingEntry.fourthStateDate) {
      trackingEntry.fourthStateDate = null;
    } else if (trackingEntry.thirdStateDate) {
      trackingEntry.thirdStateDate = null;
    } else if (trackingEntry.secondStateDate) {
      trackingEntry.secondStateDate = null;
    } else if (trackingEntry.firstStateDate) {
      trackingEntry.firstStateDate = null;
    } else {
      return res.status(400).json({ message: 'No previous state to revert to' });
    }

    await trackingEntry.save();
    res.json({ message: 'Status reverted successfully', trackingEntry });
  } catch (error) {
    console.error('Error reverting tracking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { addTrackingEntry, updateTrackingStatus,getTrackingDetails, deleteTrackingDetails, getTrackingByOrderId, getDeliveredProducts, reverseStatus, deleteDeliverProducts };
