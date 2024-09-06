import React, { useState, useEffect } from "react";
import "./OrderCancellation.scss";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_API;

function AddOrderCancellation({ onClose, orderId, onOrderCancelled }) {
  const [titleForCancellation, setTitleForCancellation] = useState("");
  const [reasonForCancellation, setReasonForCancellation] = useState("");
  const [orderIdExists, setOrderIdExists] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkOrderId = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/getOrderCancellation`
        );
        const orderCancellationData = response.data;
        // Check if orderId exists in the order cancellation data
        setOrderIdExists(
          orderCancellationData.some((data) => data.OrderID === orderId)
        );
      } catch (error) {
        console.error("Error checking orderId for cancellation:", error);
        setOrderIdExists(false); // Assume Order ID does not exist on error
      }
    };

    checkOrderId();
  }, [orderId]);

  const handleCancelOrder = async (event) => {
    event.preventDefault();

    // Get the current date and format it as a string
    const currentDate = new Date().toISOString();

    const cancellationData = {
      OrderID: orderId,
      titleForCancellation: titleForCancellation,
      reasonForCancellation: reasonForCancellation,
      cancellationDate: currentDate,
    };

    try {
      // Submit cancellation request to the backend
      const response = await axios.post(
        `http://localhost:3001/api/addOrderCancellation`,
        cancellationData
      );
      console.log("Cancellation submitted:", response.data);
      navigate(`/ulogin`);

      // Close the popup after successful cancellation
      // Close the popup after successful cancellation
      toast.success("Order Cancellation Added Successfully!");
      onOrderCancelled(orderId); // Notify parent about the cancellation

      onClose();
    } catch (error) {
      console.error("Error submitting cancellation:", error);
      // Handle error state if needed
    }
  };

  return (
    <div className="popup">
      <div id="popup-content">
        {orderIdExists ? (
          <p>This order ID is not eligible for cancellation.</p>
        ) : (
          <form onSubmit={handleCancelOrder}>
            <h1>Order Cancellation</h1>
            <p>Order ID: {orderId}</p>
            {/* <p>Product ID: {productId}</p> */}

            <label htmlFor="titleForCancellation">
              Title for cancellation:
            </label>
            <input
              type="text"
              id="titleForCancellation"
              value={titleForCancellation}
              onChange={(e) => setTitleForCancellation(e.target.value)}
              required
            />
            <label htmlFor="reasonForCancellation">
              Reason for cancellation:
            </label>
            <br></br>
            <textarea
              id="reasonForCancellation"
              value={reasonForCancellation}
              onChange={(e) => setReasonForCancellation(e.target.value)}
              minLength={10}
              maxLength={200}
              rows={6} // Adjust the number of visible rows (height)
              cols={50} // Adjust the number of visible columns (width)
              required
            ></textarea>
            <div>
              <button type="submit" className="submitButton">
                Submit
              </button>{" "}
              <br /> <br />
              <button type="button" className="deleteButton" onClick={onClose}>
                {" "}
                Close{" "}
              </button>
            </div>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddOrderCancellation;
