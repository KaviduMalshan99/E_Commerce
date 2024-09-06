import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrdersTracking.scss";
import { toast, ToastContainer } from "react-toastify";
import Notification from "./Notification";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [trackingEntries, setTrackingEntries] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [refundToDelete, setRefundToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/orders`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // const fetchCustomer = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/api/customer/${userId}`);
  //     setOrders(response.data.orders);
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //   }
  // };

  const fetchTrackingEntries = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tracking`);
      setTrackingEntries(response.data.trackingEntries);
    } catch (error) {
      console.error("Error fetching tracking entries:", error);
    }
  };

  const getOrderStatus = (orderId) => {
    const trackingEntry = trackingEntries.find(
      (entry) => entry.orderId === orderId
    );
    if (!trackingEntry) return "";

    if (trackingEntry.sixthStateDate) return "Order Complete";
    if (trackingEntry.fifthStateDate) return "Hand Over to Courier";
    if (trackingEntry.fourthStateDate) return "Arrival in Custom";
    if (trackingEntry.thirdStateDate) return "Shipping Customs"; // Add this state if it exists
    if (trackingEntry.secondStateDate) return "Overseas Custom"; // Add this state if it exists
    if (trackingEntry.firstStateDate) return "Dispatch from Overseas";

    return "";
  };

  useEffect(() => {
    fetchOrders();
    fetchTrackingEntries();
    // fetchCustomer();
  }, []);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds((prevSelectedOrderIds) => {
      const newSelectedOrderIds = new Set(prevSelectedOrderIds);
      if (newSelectedOrderIds.has(orderId)) {
        newSelectedOrderIds.delete(orderId);
      } else {
        newSelectedOrderIds.add(orderId);
      }
      return newSelectedOrderIds;
    });
  };

  const notifyCustomer = async (orderId, status) => {
    try {
      await axios.post(`http://localhost:3001/api/notify`, { orderId, status });
    } catch (error) {
      console.error("Error notifying customer:", error);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (selectedOrderIds.size === 0) {
      console.warn("Please select at least one order.");
      return;
    }

    try {
      if (status === "Dispatch from Overseas") {
        for (const orderId of selectedOrderIds) {
          await axios.post(`http://localhost:3001/api/tracking`, {
            orderId,
            status,
          });
          await notifyCustomer(orderId, status);
          toast.success(`Order ${orderId} status updated to ${status}`);
        }
      } else {
        const orderIds = Array.from(selectedOrderIds);
        await Promise.all(
          orderIds.map(async (orderId) => {
            await axios.put(`http://localhost:3001/api/tracking/${orderId}`, {
              status,
            });
            await notifyCustomer(orderId, status);
            toast.success(`Order ${orderId} status updated to ${status}`);
          })
        );
      }
      fetchTrackingEntries();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRevertStatus = async (status) => {
    if (selectedOrderIds.size === 0) {
      console.warn("Please select at least one order.");
      return;
    }

    try {
      const orderIds = Array.from(selectedOrderIds);
      await Promise.all(
        orderIds.map(async (orderId) => {
          await axios.put(
            `http://localhost:3001/api/tracking/revert/${orderId}`,
            { status }
          );
          toast.success(`Order ${orderId} status reverted to ${status}`);
        })
      );
      fetchTrackingEntries();
    } catch (error) {
      console.error("Error reverting status:", error);
      toast.error("Cannot Revert from this State");
    }
  };

  const handleDelete = (orderId) => {
    setRefundToDelete(orderId);
    setShowConfirm(true);
  };

  const deleteTrackingEntry = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/tracking/${refundToDelete}`
      );
      setTrackingEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.orderId !== refundToDelete)
      );
      toast.success("Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting tracking entry:", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    return (
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some(
        (product) =>
          product.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  // Group products by order ID
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.orderId]) {
      acc[order.orderId] = {
        ...order,
        products: [],
      };
    }
    acc[order.orderId].products = acc[order.orderId].products.concat(
      order.products
    );
    return acc;
  }, {});

  return (
    <div>
      <Notification />
      <div className="orders-container">
        <div className="top-section">
          <div className="left-panel">
            <h2>Orders ({filteredOrders.length})</h2>
            <div className="search-barTrack">
              <input
                type="text"
                placeholder="Search by Order ID, First Name or Product Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <table>
              <thead>
                <tr style={{ fontSize: "14px" }}>
                  <th>Select</th>
                  <th>Order ID</th>
                  <th>Product Names</th>
                  <th>Product Images</th>
                  <th>Name</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedOrders).map((order) => (
                  <tr key={order.orderId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.has(order.orderId)}
                        onChange={() => handleCheckboxChange(order.orderId)}
                      />
                    </td>
                    <td>{order.orderId}</td>
                    <td>
                      {order.products
                        .map((product) => product.ProductName)
                        .join(", ")}
                    </td>
                    <td>
                      {order.products.map((product) => (
                        <img
                          style={{ height: "65px" }}
                          key={product.productId}
                          src={product.image}
                          alt={product.ProductName}
                          width="65"
                          // height="60"
                        />
                      ))}
                    </td>
                    <td>{order.firstName}</td>
                    <td>{order.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="OderTracking_Status_Update" className="right-panel">
            <h2>Status Update</h2>
            {Array.from(selectedOrderIds).length > 0 ? (
              <div>
                {(() => {
                  const currentOrderId = Array.from(selectedOrderIds)[0];
                  const currentStatus = getOrderStatus(currentOrderId);
                  return (
                    <>
                      <h3>Order ID: {currentOrderId}</h3>
                      <label
                        className={
                          currentStatus === "Dispatch from Overseas"
                            ? "highlight"
                            : ""
                        }
                      >
                        <input
                          type="radio"
                          name="status"
                          value="Dispatch from Overseas"
                          checked={currentStatus === "Shipping Customs"}
                          onChange={() =>
                            handleStatusUpdate("Dispatch from Overseas")
                          }
                        />
                        Dispatch from Overseas
                      </label>
                      <label
                        className={
                          currentStatus === "Arrival in Custom"
                            ? "highlight"
                            : ""
                        }
                      >
                        <input
                          type="radio"
                          name="status"
                          value="Arrival in Custom"
                          checked={currentStatus === "Arrival in Custom"}
                          onChange={() =>
                            handleStatusUpdate("Arrival in Custom")
                          }
                        />
                        Arrival in Custom
                      </label>
                      <label
                        className={
                          currentStatus === "Hand Over to Courier"
                            ? "highlight"
                            : ""
                        }
                      >
                        <input
                          type="radio"
                          name="status"
                          value="Hand Over to Courier"
                          checked={currentStatus === "Hand Over to Courier"}
                          onChange={() =>
                            handleStatusUpdate("Hand Over to Courier")
                          }
                        />
                        Hand Over to Courier
                      </label>
                      <label
                        className={
                          currentStatus === "Delivered" ? "highlight" : ""
                        }
                      >
                        <input
                          type="radio"
                          name="status"
                          value="Delivered"
                          checked={currentStatus === "Order Complete"}
                          onChange={() => handleStatusUpdate("Delivered")}
                        />
                        Delivered
                      </label>
                      <button
                        className="revertbtn"
                        onClick={() => handleRevertStatus(currentStatus)}
                      >
                        Revert to Previous State
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <p>
                Please select an order to update its status. <br />
                (You can select more than ONE at a time)
              </p>
            )}
          </div>
        </div>
        <div className="bottom-section">
          <div className="right-panel">
            <Link to="/admin/deliveredProducts">
              <button id="delivbtn">Delivered Orders</button>
            </Link>

            <h2>Tracking Table ({trackingEntries.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Estimated Date</th>
                  <th>Country</th>
                  <th>Dispatch from Overseas</th>
                  <th>CN Custom</th>
                  <th>Air Fred Company</th>
                  <th>Arrival in Custom</th>
                  <th>Courier Selected</th>
                  <th>Delivered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trackingEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td>{entry.orderId}</td>
                    <td>{formatDate(entry.orderDate)}</td>
                    <td>{formatDate(entry.estimatedDate)}</td>
                    <td>{entry.country}</td>
                    <td>{formatDate(entry.firstStateDate)}</td>
                    <td>{formatDate(entry.secondStateDate)}</td>
                    <td>{formatDate(entry.thirdStateDate)}</td>
                    <td>
                      {entry.fourthStateDate
                        ? formatDate(entry.fourthStateDate)
                        : "-"}
                    </td>
                    <td>
                      {entry.fifthStateDate
                        ? formatDate(entry.fifthStateDate)
                        : "-"}
                    </td>
                    <td>
                      {entry.sixthStateDate
                        ? formatDate(entry.sixthStateDate)
                        : "-"}
                    </td>
                    <td>
                      <button
                        id="ordelete"
                        onClick={() => handleDelete(entry.orderId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="confirm-dialogrefun">
          <p>Are you sure you want to delete this Order Tracking?</p>
          <div>
            <button onClick={deleteTrackingEntry}>Yes</button>
            <button onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderTracking;
