const express = require('express');
const router = express.Router();
const CustomerContraller = require('./CustomerController');


router.get('/customer', CustomerContraller.getCustomer);
router.post('/addcustomer', CustomerContraller.addCustomer);
router.post("/updatecustomer/:UserId", CustomerContraller.updateCustomer);
router.delete('/deletecustomer', CustomerContraller.deleteCustomer);
router.post('/login', CustomerContraller.login);
// Setup in your Express router file
router.get('/customer/:_id', CustomerContraller.getCustomerById);




module.exports = router;