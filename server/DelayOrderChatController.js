const Message = require('./DelayOrderChatModel');




const getMessagesByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const messages = await Message.find({ orderId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderIds = async (req, res) => {
  try {
    const orders = await Message.distinct('orderId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCustomerMessages = async (req, res) => {
  try {
    const messages = await Message.find({ orderId: 'OID74640' }); // Fetch messages for specific order ID
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCustomerMessage = async (req, res) => {
  const message = new Message({
    sender: req.body.sender,
    message: req.body.message,
    //orderId: 'O1234'
      orderId: 'OID74640'
     //orderId: 'O2345' // Hardcoded order ID
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCustomerMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message == null) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (req.body.sender != null) {
      message.sender = req.body.sender;
    }
    if (req.body.message != null) {
      message.message = req.body.message;
    }
    const updatedMessage = await message.save();
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteCustomerMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






module.exports = { getAllCustomerMessages, createCustomerMessage, updateCustomerMessage, deleteCustomerMessage,getMessagesByOrderId, getOrderIds };
