import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const OrderCancellation = () => {
  const [cancellations, setCancellations] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false); // Confirmation dialog state
  const [cancellationToDelete, setCancellationToDelete] = useState(null); // State variable to store cancellation to delete

  useEffect(() => {
    fetchCancellations();
  }, []);

  const fetchCancellations = () => {
    axios
      .get(`http://localhost:3001/api/getOrderCancellation`)
      .then((response) => {
        setCancellations(response.data.response);
      })
      .catch((error) => {
        console.error("Error fetching order cancellations:", error);
      });
  };

  const handleDelete = (OrderID) => {
    setCancellationToDelete(OrderID);
    setShowConfirm(true); // Show confirmation dialog
  };

  const confirmDelete = () => {
    axios
      .delete(
        `http://localhost:3001/api/deleteOrderCancellation/${cancellationToDelete}`
      )
      .then((res) => {
        setCancellations((prevCancellations) =>
          prevCancellations.filter(
            (cancellation) => cancellation.OrderID !== cancellationToDelete
          )
        );
        toast.success("Order cancellation deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting order cancellation:", err);
        toast.error("Error deleting order cancellation.");
      })
      .finally(() => {
        // Close the confirmation dialog
        setShowConfirm(false);
      });
  };

  return (
    <div className="mainContainer">
      <h1>Order Cancellations</h1>
      <div>
        <h3 className="subtitle">Cancelled Orders ({cancellations.length})</h3>
      </div>
      <div className="categorytable">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Title for Cancellation</th>
              <th>Reason for Cancellation</th>
              <th>Cancellation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cancellations.map((cancellation) => (
              <tr key={cancellation.OrderID}>
                <td>{cancellation.OrderID}</td>
                <td>{cancellation.titleForCancellation}</td>
                <td>{cancellation.reasonForCancellation}</td>
                <td>
                  {new Date(cancellation.cancellationDate).toLocaleDateString(
                    "en-US"
                  )}
                </td>
                <td>
                  <button
                    className="deletebtn"
                    onClick={() => handleDelete(cancellation.OrderID)}
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
          <p>Are you sure you want to delete this order cancellation?</p>
          <div>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowConfirm(false)}>No</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderCancellation;
