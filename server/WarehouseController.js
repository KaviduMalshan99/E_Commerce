const Warehouse = require('./WarehouseModel'); // Adjust the path as necessary

// Middleware to find warehouse by custom ID
async function getWarehouse(req, res, next) {
  try {
    const warehouse = await Warehouse.findOne({ id: req.params.id });
    if (!warehouse) {
      return res.status(404).json({ message: 'Cannot find warehouse' });
    }
    res.warehouse = warehouse;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Error finding warehouse: ' + err.message });
  }
}

// Controller to get all warehouses
async function getAllWarehouses(req, res) {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Controller to add a new warehouse
async function addWarehouse(req, res) {
  try {
    const warehouse = new Warehouse({ ...req.body });
    await warehouse.save();
    res.status(201).json(warehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Controller to get a unique warehouse by ID
async function getWarehouseById(req, res) {
  res.json(res.warehouse);
}

// Controller to update a warehouse
async function updateWarehouse(req, res) {
  Object.entries(req.body).forEach(([key, value]) => {
    res.warehouse[key] = value;
  });
  try {
    await res.warehouse.save();
    res.json(res.warehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Controller to delete a warehouse
async function deleteWarehouse(req, res) {
  try {
    await res.warehouse.deleteOne();
    res.json({ message: 'Deleted Warehouse' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Controller to get the next available ID
async function getNextId(req, res) {
  try {
    const lastWarehouse = await Warehouse.findOne().sort({ id: -1 });
    let nextId = "WH001"; // Default ID if no warehouses exist yet

    if (lastWarehouse && lastWarehouse.id) {
      const lastIdNumber = parseInt(lastWarehouse.id.match(/\d+/)[0]);
      nextId = `WH${(lastIdNumber + 1).toString().padStart(3, '0')}`; // Increment and pad with leading zeros
    }

    res.json({ nextId }); // Return the next available ID in the response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getWarehouse,
  getAllWarehouses,
  addWarehouse,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getNextId
};
