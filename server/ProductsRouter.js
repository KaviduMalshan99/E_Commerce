const express = require('express');
const router = express.Router();
const productContraller = require('./ProductController');

router.get('/produts',productContraller.getProducts);
router.post('/addproduct',productContraller.addProducts);
router.put('/updateproduct',productContraller.updateProduct);
router.delete('/deleteproduct',productContraller.deleteproduct);

module.exports = router;