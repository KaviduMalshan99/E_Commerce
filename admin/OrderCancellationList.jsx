import React, { useState, useEffect } from "react";
import "./refundOrders.scss";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Extract and return YYYY-MM-DD part
};

const OrderCancellationList = () => {
  const [orderCancellations, setOrderCancellations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrderCancellations, setFilteredOrderCancellations] = useState(
    []
  );

  useEffect(() => {
    fetchOrderCancellations();
  }, []);

  useEffect(() => {
    // Filter order cancellations based on search query
    const filtered = orderCancellations.filter((orderCancellation) => {
      const orderIdMatch =
        orderCancellation.OrderID.toString().includes(searchQuery);
      const productIdMatch = orderCancellation.id
        .toString()
        .includes(searchQuery);
      return orderIdMatch || productIdMatch;
    });
    setFilteredOrderCancellations(filtered);
  }, [orderCancellations, searchQuery]);

  const fetchOrderCancellations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/getOrderCancellation`
      );
      setOrderCancellations(response.data.response);
    } catch (error) {
      console.error("Error fetching order cancellations:", error);
    }
  };

  const handleDeleteOrderCancellation = async (OrderID) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/deleteOrderCancellation/${OrderID}`
      );
      console.log(
        `Order cancellation with ID ${OrderID} deleted successfully.`
      );
      toast.success("Order cancellation deleted successfully!", {
        autoClose: 3000,
      });
      // After deletion, fetch the updated list of order cancellations
      fetchOrderCancellations();
    } catch (error) {
      console.error("Error deleting order cancellation:", error);
      toast.error("Failed to delete order cancellation", { autoClose: 3000 });
    }
  };

  const generateReport = () => {
    toast.info("Order cancellation report downloading", { autoClose: 3000 });

    // Create a new PDF instance
    const doc = new jsPDF();
    const rows = filteredOrderCancellations.map((orderCancellation) => {
      return [
        orderCancellation.OrderID,
        orderCancellation.id,
        formatDate(orderCancellation.cancellationDate),
        orderCancellation.titleForCancellation,
        orderCancellation.reasonForCancellation,
      ];
    });

    // Set the table headers
    const headers = [
      "Order ID",
      "Product ID",
      "Cancellation Date",
      "Title for Cancellation",
      "Reason for Cancellation",
    ];

    // Add the table to the PDF document
    doc.autoTable({ head: [headers], body: rows });

    // Save the PDF
    doc.save("order_cancellations_report.pdf");
  };

  return (
    <div>
      <h1>Order Cancellation List</h1>
      <div className="cancellationSerch">
        <input
          type="text"
          placeholder="Search by Order ID or Product ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="generateReportButton" onClick={generateReport}>
          Generate Report
        </button>
      </div>
      <br />
      <br />
      <center>
        <div>
          <table className="categorytable">
            <tbody>
              <tr>
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Cancellation Date</th>
                <th>Title for Cancellation</th>
                <th>Reason for Cancellation</th>
                <th>Delete</th>
              </tr>
              {filteredOrderCancellations.map((orderCancellation, index) => (
                <tr key={index}>
                  <td>{orderCancellation.OrderID}</td>
                  <td>{orderCancellation.id}</td>
                  <td>{formatDate(orderCancellation.cancellationDate)}</td>
                  <td>{orderCancellation.titleForCancellation}</td>
                  <td>{orderCancellation.reasonForCancellation}</td>
                  <td>
                    <button
                      className="deletebtn"
                      onClick={() =>
                        handleDeleteOrderCancellation(orderCancellation.OrderID)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>
      <ToastContainer />
    </div>
  );
};

export default OrderCancellationList;
