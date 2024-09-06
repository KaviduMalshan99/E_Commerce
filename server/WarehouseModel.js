const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  country: String,
  city: String,
  address: String,
  mail: String,
  telNo: String,
  activeStatus: Boolean,
});

// Pre-save hook to generate and set the ID field if it's not provided
WarehouseSchema.pre('save', async function (next) {
  // If ID is not provided, generate and set the ID
  if (!this.id) {
    try {
      // Find the last warehouse document to determine the next ID
      const lastWarehouse = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
      let nextId = "WH001"; // Default ID if no warehouses exist yet

      if (lastWarehouse && lastWarehouse.id) {
        // Extract the numeric part of the last ID and increment it
        const lastIdNumber = parseInt(lastWarehouse.id.match(/\d+/)[0]);
        nextId = `WH${(lastIdNumber + 1).toString().padStart(3, '0')}`; // Increment and pad with leading zeros
      }
      
      // Set the generated ID
      this.id = nextId;
    } catch (error) {
      return next(error);
    }
  }

  next(); // Continue with saving
});

module.exports = mongoose.model('Warehouse', WarehouseSchema);
