const express = require("express");
const router = express.Router();
const contraller = require("./contraller");
const { route } = require("./app");

const {
  addCoupon,
  validateCoupon,
  getAllCoupons,
  deactivateCoupon,
  deleteCoupon,
  reactivateCoupon,
} = require("./CouponController");
const catagoryContraller = require("./CatagoryController");
const customerContraller = require("./CustomerController");
const orderContraller = require("./OrderController");
const productContraller = require("./ProductController");
const reviewcontroller = require("./ReviewController");
const faqcontroller = require("./FaqController");
const RefundController = require("./RefundController");
const SupplierRegController = require("./SupplierRegController");
const SupplierStockController = require("./SupplierStockController");
const dispatchedOrderController = require("./DispatchedOrdersController");

const CurrentStockController = require("./CurrentStockController");
const {
  createOrUpdateNotification,
  getNotifications,
} = require("./NotificationController");

const AcceptedStockController = require("./AcceptedStockController");
// const OrdersTableController = require('./OrdersTableController');
const {
  getWarehouse,
  getAllWarehouses,
  addWarehouse,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  getNextId,
} = require("./WarehouseController");

const OrderCancellationController = require("./OrderCancellationController");
const messageController = require("./DelayOrderChatController");
const trackingController = require("./OrderTrackingController");

const cartController = require("./AddtocartContraller");
const shippingMethodController = require("./ShippingMethodController");

const authMiddleware = require("../server/middleware/authMiddleware");
const USER_ROLES = require("../server/constants/roles");

router.get("/users", contraller.getUsers);
router.post("/createuser", contraller.addUser);
router.post("/updateuser", contraller.updateUser);
router.post("/deleteuser", contraller.deleteUser);

//category
router.get("/categories", catagoryContraller.getCategories);
router.post("/addcategories", catagoryContraller.addCategory);
router.post("/deletecategories/:id", catagoryContraller.deleteCategory);
router.post("/updatecategory/:id", catagoryContraller.updateCategory);

//addtocart
router.get("/cart/:customerId", cartController.getCart);
router.post("/cart/add", cartController.addToCart);
router.put("/updatecart", cartController.updateCartItem);
router.delete("/deletecart/:cartId", cartController.removeCartItem);

//customer
router.get(
  "/customer",
  authMiddleware([USER_ROLES.ADMIN]),
  customerContraller.getCustomer
);

router.post("/addcustomer", customerContraller.addCustomer);
router.post("/updatecustomer/:UserId", customerContraller.updateCustomer);
router.delete("/deletecustomer/:UserId", customerContraller.deleteCustomer);
router.post("/login", customerContraller.login); // Ensure this is a POST, not GET
router.post("/register", customerContraller.register);
router.get("/customer/:UserId", customerContraller.getCustomerById);
router.get("/customer/email/:email", customerContraller.getCustomerByEmail);
router.post("/auth/google", customerContraller.googleLogin);
router.post("/auth/facebook", customerContraller.facebookLogin);
router.post("/forgot-password", customerContraller.forgotPassword);
router.post("/reset-password/:token", customerContraller.resetPassword);

//order
router.get("/orders", orderContraller.getOrders);

router.post("/orders/sendemail", orderContraller.sendOrderStatusEmail);
router.put("/updatestatus", orderContraller.updateOrderStatus);
router.put(
  "/updateContactStatus/:orderId",
  orderContraller.updateContactStatus
);

router.post("/addOrder", orderContraller.addOrder);
router.put("./updateOrder", orderContraller.updateOrder);
router.delete("/deleteOrder/:orderId", orderContraller.deleteOrder);
router.get("/getOrder/:orderId", orderContraller.getOrderById);
router.get(
  "/orders/customer/:customerId",
  orderContraller.getOrdersByCustomerId
); // This should match the endpoint you call in your React component.

//product
router.get("/products", productContraller.getProducts);
router.get("/products/:productId", productContraller.getProductById);
router.post("/addproduct", productContraller.addProduct);
router.put("/updateproduct/:productId", productContraller.updateProduct);
router.delete("/deleteproduct/:ProductId", productContraller.deleteProduct);
router.get("/search", productContraller.searchProducts); // search bar
router.get('/reviews-with-products/:userId', productContraller.getReviewsWithProductNames);


//review
router.get("/reviews", reviewcontroller.getReview);
router.get("/review/:ReviewID", reviewcontroller.getReviewById);
router.post("/addreviews", reviewcontroller.addReview);
router.post("/updatereview/:ReviewID", reviewcontroller.updateReview);
router.delete("/deletereview/:ReviewID", reviewcontroller.deleteReview);
router.get("/reviews/:customerId", reviewcontroller.getReviewsByCustomerId);
router.get(
  "/reviewsByProductId/:productId",
  reviewcontroller.getReviewsByProductId
);

//acceptreview
router.post("/acceptreview/:ReviewID", reviewcontroller.acceptReview);
router.get("/acceptreviews", reviewcontroller.getacceptReview);
router.get("/acceptedreviews/:ReviewID", reviewcontroller.getReviewById);
router.delete("/acceptdelete/:ReviewID", reviewcontroller.deleteacceptReview);

//faq
router.get("/faqs", faqcontroller.getFaq);
router.post("/addfaqs", faqcontroller.addFaq);
router.delete("/deletefaq/:FaqID", faqcontroller.deleteFaq);
router.get("/faq/:FaqID", faqcontroller.getFaqById);

//refund
router.post("/addrefund", RefundController.addRefund);
router.get("/refunds", RefundController.getRefunds);
router.delete("/deleterefund/:id", RefundController.deleteRefund);
router.put("/updaterefund/:orderId", RefundController.updateRefund);
router.get("/refund/:orderId", RefundController.getRefundById);
router.put("/approverefund/:orderId", RefundController.approveRefund);
router.get("/acceptrefunds", RefundController.getAcceptedRefunds);
router.delete("/deleteAccrefund/:id", RefundController.deleteAccRefund);

// //refundemail
// const { sendEmail } = require("../controllers/emailControllers");

// router.post("/sendEmail", sendEmail);

//supplierReg

router.post("/addsupplier", SupplierRegController.addSupplierReg);
router.get("/suppliers", SupplierRegController.getSuppliers);
//router.get('/supplierdetails/:userId',SupplierRegController.getSuppliersdetails);
router.put("/suppliers/:id", SupplierRegController.updateSupplier);
router.delete("/suppliers/:id", SupplierRegController.deleteSupplier);

router.delete(
  "/supplierstock/:supstockId",
  SupplierStockController.deleteStockBySupStockId
);

//suplierstock
router.post("/addstock", SupplierStockController.addSupplierStock);
router.get("/getstock", SupplierStockController.getStock);

//Warehouse
// router.get("/oders", OrdersTableController.getOrdersTable);
// router.post("/addorder", OrdersTableController.addOrdersTable);
// router.put("/updateorder", OrdersTableController.updateOrdersTable);
// router.delete("/deleteorder", OrdersTableController.deleteOrdersTable);
// router.post('/orders/sendemail', OrdersTableController.sendOrderStatusEmail);
// router.put("/updatestatus", OrdersTableController.updateOrdersTableStatus);
// router.put("/updateContactStatus/:orderId", OrdersTableController.updateContactStatus);

// Routes for warehouse operations
router.get("/warehouse", getAllWarehouses);
router.post("/addwarehouse", addWarehouse);
router.get("/warehouse/:id", getWarehouse, getWarehouseById);
router.patch("/updatewarehouse/:id", getWarehouse, updateWarehouse);
router.delete("/deletewarehouse/:id", getWarehouse, deleteWarehouse);
router.get("/nextId", getNextId);

router.get(
  "/stocks/:warehouseId",
  CurrentStockController.getStockByWarehouseId
);
router.post("/stocks", CurrentStockController.createProductStock);
router.put("/stocks/:id", CurrentStockController.updateProductStock);
router.delete("/stocks/:id", CurrentStockController.deleteProductStock);
router.get("/stocks", CurrentStockController.getAllProductStocks);
router.put("/dispatchOrder", CurrentStockController.dispatchOrder);

router.post("/acceptstock/:id", CurrentStockController.acceptAndModifyStock);

// Route to fetch all accepted stocks
router.get("/acceptedstocks", AcceptedStockController.getAcceptedStocks);

//Notifications Inventory

router.post("/notifications", createOrUpdateNotification);
router.get("/notifications", getNotifications);

// Route to create a dispatched order
router.post(
  "/dispatchedOrders",
  dispatchedOrderController.createDispatchedOrder
);
router.post(
  "/adjustStockQuantities",
  CurrentStockController.adjustStockQuantities
);

router.delete(
  "/dispatchedOrders",
  dispatchedOrderController.deleteAllDispatchedOrders
);

// Shipping Methods
router.post("/shippingMethods", shippingMethodController.addShippingMethod);
router.get("/shippingMethods", shippingMethodController.getShippingMethods);
router.put(
  "/shippingMethods/:id",
  shippingMethodController.updateShippingMethod
);
router.delete(
  "/shippingMethods/:id",
  shippingMethodController.deleteShippingMethod
);

// Coupon routes
router.post("/addcoupon", addCoupon);
router.get("/coupons", getAllCoupons);
router.post("/validatecoupon", validateCoupon);
router.post("/deactivateCoupon", deactivateCoupon);
router.delete("/coupons/:code", deleteCoupon); // New route for deleting a coupon
router.post("/reactivateCoupon/:code", reactivateCoupon); // Optional: route for reactivating a coupon

//AddCancellation
router.post(
  "/addOrderCancellation",
  OrderCancellationController.addOrderCancellation
);
router.get(
  "/getOrderCancellation",
  OrderCancellationController.getOrderCancellation
);
router.delete(
  "/deleteOrderCancellation/:OrderID",
  OrderCancellationController.deleteOrderCancellation
);

//delayOrderChat

router.get("/getAllMessages", messageController.getAllCustomerMessages);
router.post("/createMessage", messageController.createCustomerMessage);
router.put("/updateMessage/:id", messageController.updateCustomerMessage);
router.delete("/deleteMessage/:id", messageController.deleteCustomerMessage);
router.get(
  "/getMessagesByOrderId/:orderId",
  messageController.getMessagesByOrderId
);
router.get("/getOrderIds", messageController.getOrderIds);

//Tracking

router.post("/tracking", trackingController.addTrackingEntry);
router.get(
  "/tracking/:orderId/:productId",
  trackingController.getTrackingByOrderId
);
router.get("/tracking", trackingController.getTrackingDetails);
router.delete("/tracking/:orderId", trackingController.deleteTrackingDetails);
router.put("/tracking/:orderId", trackingController.updateTrackingStatus);
router.get("/deliveredproducts", trackingController.getDeliveredProducts);
router.delete("/delproduct/:orderId", trackingController.deleteDeliverProducts);
// router.post('/statusemail', trackingController.sendTrackingEmail);
router.put("/tracking/revert/:orderId", trackingController.reverseStatus);

router.get("/orders", orderContraller.getOrders);
router.post("/orders", orderContraller.addOrder);

module.exports = router;
