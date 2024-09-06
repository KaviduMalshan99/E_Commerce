const SupplierReg = require("./SupplierRegModel");
const express = require('express');
const router = express.Router();


const addSupplierReg = (req, res, next) => {
    const {
        fullName,companyName,email,contactNumber,nic,supplyproduct,city,country,nearestWarehouse    
    
    } = req.body;

    const supplierreg = new SupplierReg({
        fullName,companyName,email,contactNumber,nic,supplyproduct,city,country,nearestWarehouse
    });

    supplierreg.save()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};


const getSuppliers = (req,res, next)=>{
    SupplierReg.find()
    .then(response =>{
        res.json({response});
    })
    .catch(error => {
        res.json({message:error})
    });
};


// const getSuppliersdetails = async (req, res, next) => { // Here, added 'async' keyword
//     const userId = req.params.userId;

//     try {
//         const supplier = await SupplierReg.findOne({ UserId: userId });
//         if (!supplier) {
//             return res.status(404).json({ error: 'Supplier Not found' });
//         }

//         res.json({ supplier });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const updateSupplier = (req, res, next) => {
    const id = req.params.id;
    const {
        fullName, companyName, email, contactNumber, nic, supplyproduct, city, country, nearestWarehouse
    } = req.body;

    SupplierReg.findByIdAndUpdate(id, {
        fullName, companyName, email, contactNumber, nic, supplyproduct, city, country, nearestWarehouse
    }, { new: true })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};
  
  // Delete a supplier
  const deleteSupplier = (req, res, next) => {
    const id  = req.params.id;

    SupplierReg.findByIdAndDelete(id)
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};


module.exports ={addSupplierReg, getSuppliers, updateSupplier, deleteSupplier};