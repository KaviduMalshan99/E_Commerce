// RefundRouter.js

const express = require('express');
const router = express.Router();
const RefundController = require('./RefundController');

router.get('/refunds', RefundController.getRefunds);
router.post('/addrefund', RefundController.addRefund);
router.put('/updaterefund/:orderId', RefundController.updateRefund);
router.delete('/deleterefund/:id', RefundController.deleteRefund);
router.get('/refund/:orderId', RefundController.getRefundById);
router.put('/approverefund/:orderId', RefundController.approveRefund);
router.get('/acceptrefunds', RefundController.getAcceptedRefunds);


module.exports = router;