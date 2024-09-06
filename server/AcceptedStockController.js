const AcceptedStock = require('./AcceptedStockModel');
const ProductStock = require('./CurrentStockModel');

// Controller function to add a new accepted stock
const addAcceptedStock = (req, res, next) => {
    const {
        supstockId,
        supproductId,
        supproductnamee,
        sizes,
        colors,
        stockquantity,
        warehousenameid
    } = req.body;

    const acceptedStock = new AcceptedStock({
        supstockId,
        supproductId,
        supproductnamee,
        sizes,
        colors,
        stockquantity,
        warehousenameid
    });

    acceptedStock.save()
        .then(response => {
            res.json({ message: "Accepted stock added successfully", response });
        })
        .catch(error => {
            res.status(500).json({ message: "Error adding accepted stock", error: error.message });
        });
};

// Controller function to retrieve all accepted stocks
const getAcceptedStocks = (req, res, next) => {
    AcceptedStock.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching accepted stocks", error: error.message });
        });
};

module.exports = {
    addAcceptedStock,
    getAcceptedStocks
};


// Function to accept stock and update the quantity in the current stock
exports.acceptAndModifyStock = async (req, res) => {
    const { productId, productName, sizes, colors, warehouseId, stockquantity, supstockId } = req.body;
    const numericQuantity = Number(stockquantity);

    console.log("Received data:", req.body);

    // Move to AcceptedStock table
    const acceptedStock = new AcceptedStock({
        supstockId,
        supproductId: productId,
        supproductnamee: productName,
        sizes,
        colors,
        stockquantity: numericQuantity,
        warehousenameid: warehouseId,
        acceptedDate: new Date()
    });

    try {
        await acceptedStock.save();
        console.log("Accepted stock saved:", acceptedStock);

        // Check if the stock exists in the CurrentStock table
        let stock = await ProductStock.findOne({ productId, warehouseId });
        console.log("Current stock found:", stock);

        if (stock) {
            // If stock exists, update the quantity
            stock.stockquantity += numericQuantity;
            await stock.save();
            console.log("Updated existing stock:", stock);
        } else {
            // If no current stock exists, create a new record
            stock = new ProductStock({ productId, productName,sizes, colors, warehouseId, stockquantity: numericQuantity });
            await stock.save();
            console.log("Created new stock entry:", stock);
        }

        res.status(201).json({ message: "Stock accepted and updated successfully", acceptedStock, currentStock: stock });
    } catch (error) {
        console.error("Error in acceptAndModifyStock:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Example function to determine if stock should be deleted
function shouldDeleteStock(stock) {
    // Implement your condition to decide if the stock needs to be deleted
    return false; // Default to not deleting unless condition is met
}