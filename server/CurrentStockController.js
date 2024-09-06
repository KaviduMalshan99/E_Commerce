const ProductStock = require('./CurrentStockModel');
const AcceptedStock = require('./AcceptedStockModel');
const DispatchedOrder = require('./DispatchedOrdersModel');
 // Ensure this is correct

exports.getStockByWarehouseId = async (req, res) => {
  try {
    const warehouseId = req.params.warehouseId;
    const stocks = await ProductStock.find({ warehouseId: warehouseId });
    if (stocks.length === 0) {
      return res.status(404).json({ message: "No stock found for this warehouse." });
    }
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createProductStock = async (req, res) => {
  const newStock = new ProductStock(req.body);
  try {
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProductStock = async (req, res) => {
  try {
    const updatedStock = await ProductStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProductStock = async (req, res) => {
  try {
    await ProductStock.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted Successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.acceptAndModifyStock = async (req, res) => {
  try {
      const { productId, productName,sizes, colors, warehouseId, stockquantity, supstockId } = req.body;
      const numericQuantity = Number(stockquantity);

      // Update current stock
      let stock = await ProductStock.findOne({ productId, productName,sizes, colors, warehouseId });
      if (stock) {
          stock.stockquantity += numericQuantity;
          await stock.save();
      } else {
          stock = new ProductStock({ productId, productName,sizes, colors, warehouseId, stockquantity: numericQuantity });
          await stock.save();
      }

      // Move to AcceptedStock table
      const acceptedStock = new AcceptedStock({
          supstockId,
          supproductId: productId,
          supproductnamee: productName,
          sizes,
          colors,
          stockquantity: numericQuantity,
          warehousenameid: warehouseId
      });
      await acceptedStock.save();

      // Delete from original table (CurrentStockModel)
      await ProductStock.findOneAndDelete({ productId, productName,sizes, colors, warehouseId });

      res.json(acceptedStock);
  } catch (error) {
      console.error("Error in acceptAndModifyStock:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};




exports.getAllProductStocks = async (req, res) => {
  try {
    const stocks = await ProductStock.find({});
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Controller Function to Adjust Stock
exports.dispatchOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Retrieve the relevant product stock
    const stock = await ProductStock.findOne({ productId: order.productId });
    if (!stock || stock.stockquantity < order.quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Reduce the stock quantity
    stock.stockquantity -= order.quantity;
    await stock.save();

    // Update the order status
    order.status = "Dispatched";
    await order.save();

    res.json({ message: "Order dispatched and stock adjusted", stock, order });
  } catch (error) {
    console.error("Error dispatching order:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.adjustStockQuantities = async (req, res) => {
    try {
        // Retrieve all dispatched orders
        const dispatchedOrders = await DispatchedOrder.find();

        // Process each dispatched order to update stock
        for (const order of dispatchedOrders) {
            const productStock = await ProductStock.findOne({ productId: order.productId });
            if (productStock) {
                productStock.stockquantity -= order.quantity;
                if (productStock.stockquantity < 0) {
                    productStock.stockquantity = 0; // Prevent negative stock values
                }
                await productStock.save();
            }
        }

        res.json({ success: true, message: "Stock quantities updated successfully." });
    } catch (error) {
        console.error("Failed to adjust stock quantities:", error);
        res.status(500).json({ error: error.message });
    }
};
