import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ordertable.scss";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/orders`);
      const ordersData = response.data.orders.map((order) => ({
        ...order,
        orderDate: new Date(order.orderDate),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Function to handle downloading orders data as Excel file
  const downloadExcel = (filteredOrders, fileName) => {
    const ordersDataForExcel = filteredOrders.map((order) => ({
      orderId: order.orderId,
      orderDate: order.orderDate.toLocaleDateString(),
      country: order.country,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      contactNumber: order.contactNumber,
      address: order.address,
      address02: order.address02,
      city: order.city,
      postalCode: order.postalCode,
      additionalDetails: order.additionalDetails,
      shippingMethod: order.shippingMethod,
      paymentMethod: order.paymentMethod,
      couponCode: order.couponCode,
      total: order.total,
      products: order.products.map((product) => ({
        ProductName: product.ProductName,
        productId: product.productId, // Use productId instead of id
        quantity: product.quantity,
        size: product.size,
        color: product.color,
        price: product.price,
      })),
    }));

    // Flatten the products for each order to avoid nested arrays in the Excel file
    const ordersDataFlat = ordersDataForExcel.flatMap((order) => {
      return order.products.map((product) => ({
        orderId: order.orderId,
        orderDate: order.orderDate,
        country: order.country,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        contactNumber: order.contactNumber,
        address: order.address,
        address02: order.address02,
        city: order.city,
        postalCode: order.postalCode,
        additionalDetails: order.additionalDetails,
        shippingMethod: order.shippingMethod,
        paymentMethod: order.paymentMethod,
        couponCode: order.couponCode,
        total: order.total,
        ProductName: product.ProductName,
        productId: product.productId,
        quantity: product.quantity,
        size: product.size,
        color: product.color,
        price: product.price,
      }));
    });

    const ws = XLSX.utils.json_to_sheet(ordersDataFlat);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, fileName);
  };

  // Download all orders as Excel file
  const downloadAllOrdersExcel = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    const fileName = `OrderData_${formattedDate}.xlsx`;
    downloadExcel(orders, fileName);
  };

  // Download orders of the current month as Excel file
  const downloadMonthlyOrdersExcel = () => {
    const date = new Date();
    const currentMonth = date.getMonth();
    const filteredOrders = orders.filter(
      (order) => order.orderDate.getMonth() === currentMonth
    );
    const fileName = `MonthlyOrderData_${
      date.toISOString().split("T")[0]
    }.xlsx`;
    downloadExcel(filteredOrders, fileName);
  };

  // Navigate to shipping method page
  const addShippingMethod = () => {
    navigate("/admin/shipping");
  };

  // Navigate to apply coupon page
  const applyCoupon = () => {
    navigate("/admin/coupon");
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle country filter change
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // Handle payment method filter change
  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  // Handle start date change
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  // Handle end date change
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Confirm delete order
  const confirmDelete = (orderId) => {
    setCurrentOrderId(orderId);
    setShowConfirm(true);
  };

  // Delete order
  const deleteOrder = () => {
    axios
      .delete(`http://localhost:3001/api/deleteOrder/${currentOrderId}`)
      .then(() => {
        setOrders((prev) => prev.filter((o) => o.orderId !== currentOrderId));
        setShowConfirm(false);
        toast.success("Order deleted successfully");
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        setShowConfirm(false);
        toast.error("Error deleting order");
      });
  };

  // Filter orders based on search query and filters
  const filteredOrders = orders.filter((order) => {
    const isWithinDateRange =
      startDate && endDate
        ? order.orderDate >= new Date(startDate) &&
          order.orderDate <= new Date(endDate)
        : true;

    return (
      isWithinDateRange &&
      (order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        searchQuery === "") &&
      (order.country === selectedCountry || selectedCountry === "All") &&
      (order.paymentMethod === selectedPaymentMethod ||
        selectedPaymentMethod === "All")
    );
  });

  return (
    <div className="order-table-container">
      <ToastContainer />
      <div className="header">
        <h2>Order Table</h2>
        <div className="button-group">
          <button className="export-btn" onClick={downloadAllOrdersExcel}>
            Export to Excel
          </button>
          <button className="export-btn" onClick={downloadMonthlyOrdersExcel}>
            Export Monthly Orders
          </button>
          <button className="method-btn" onClick={addShippingMethod}>
            Add Shipping Method
          </button>
          <button className="coupon-btn" onClick={applyCoupon}>
            Coupon
          </button>
        </div>
      </div>
      <div className="controls-container">
        <div className="filter-container">
          <label className="filter-label">Country:</label>
          <select
            className="filter-dropdown"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="All">All Countries</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="US">US</option>
            <option value="India">India</option>
          </select>
          <label className="filter-label">Payment Method:</label>
          <select
            className="filter-dropdown"
            value={selectedPaymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <option value="All">All Methods</option>
            <option value="koko">Koko</option>
            <option value="webxpay">WebXpay</option>
            <option value="cod">COD</option>
          </select>
          <input
            type="text"
            placeholder="Search by Order ID"
            className="search-bar"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <label className="filter-label">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="date-picker"
          />
          <label className="filter-label">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="date-picker"
          />
        </div>
      </div>
      <div className="table-wrapper">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Country</th>
              <th>Payment Method</th>
              <th>No of Item(s)</th>
              <th>Date</th>
              <th>All Order Details</th>
              <th>Remove Order</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>
                  {order.firstName} {order.lastName}
                </td>
                <td>{order.country}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.products.length}</td>
                <td>{order.orderDate.toLocaleDateString()}</td>
                <td>
                  <button
                    className="view-more-btn"
                    onClick={() =>
                      navigate(`/admin/OrderDetails/${order.orderId}`)
                    }
                  >
                    View More
                  </button>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => confirmDelete(order.orderId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showConfirm && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this order?</p>
          <div>
            <button onClick={deleteOrder}>Yes</button>
            <button onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
