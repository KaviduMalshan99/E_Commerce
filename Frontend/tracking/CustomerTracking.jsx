import React, { useState, useEffect } from "react";
import axios from "axios";
import AddOrderCancellation from "./AddOrderCancellation";
import DelayOrderInquiry from "./DelayOrderInquiry.jsx";
import "./CustomerTracking.scss";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useParams, Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import LOGOO from "../../src/assets/logoorange.png";
import { PropagateLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const CustomerTracking = () => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDelayOrderPopup, setShowDelayOrderPopup] = useState(false);
  const { orderId, productId } = useParams();
  const location = useLocation();
  const { country, image, ProductName, address, quantity, total, color, size } =
    location.state || {};

  console.log("Image URL:", image); // Add this line to verify if the image URL is being passed correctly
  console.log("location.state:", location.state);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/tracking/${orderId}/${productId}`
        );
        setTrackingInfo(data.trackingEntry);
        setLoading(false);
      } catch (err) {
        setError("Tracking information not available.");
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [orderId, productId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const isActiveStep = (stepDate) => {
    const currentDate = new Date();
    return new Date(stepDate) <= currentDate;
  };

  const handleDeliveredClick = async () => {
    try {
      await axios.put(`http://localhost:3001/api/tracking/${orderId}`, {
        status: "Delivered",
      });
      toast.success("Order marked as delivered.");
      window.location.reload(); // Reload the page to reflect the changes
    } catch (err) {
      toast.error("Failed to update delivery status.");
    }
  };

  if (loading) return;
  <div className="loader-container">
    <div className="loader-overlay">
      <img
        src={LOGOO}
        alt="Logo"
        className="loader-logo"
        style={{ height: "100px", width: "100px", background: "#050517" }}
      />
      <PropagateLoader color={"#ff3c00"} loading={true} />
    </div>
  </div>;
  if (error)
    return (
      <div className="loadTrack">
        <Header />
        <div className="track-empty">
          <p className="track1">Tracking information not available yet...!</p>
          {/* <button onClick={() => navigate('/')}>Continue Shopping</button> */}
          <Link to="/">
            <button>Continue Shopping</button>
          </Link>
        </div>
        <Footer />
      </div>
    );

  const trackingSteps = {
    "Sri Lanka": [
      " dispatched from Overseas",
      " arrived at Overseas Custom",
      " handed over to Shipping Customs",
      ` arrived at Sri Lanka custom`,
      " handed over to Courier company",
      " delivered. Thank you for shopping WELL WORN",
    ],
    INDIA: [
      " dispatched from the Chinese warehouse",
      " handed over to Shipping Customs",
      " delivered. Thank you for shopping WELL WORN",
    ],
    USA: [
      " dispatched from the Chinese warehouse",
      " handed over to Shipping Customs",
      " delivered. Thank you for shopping WELL WORN",
    ],
  };

  const trackingStatus = {
    "Sri Lanka": [
      "Dispatch from Overseas",
      "Overseas Custom",
      "Shipping Customs",
      "Arrived at SL custom",
      "Hand Over to Courier",
      "Order Complete",
    ],
    INDIA: ["Dispatch from Overseas", "Shipping Customs", "Order Complete"],
    USA: ["Dispatch from Overseas", "Shipping Customs", "Order Complete"],
  };

  const filteredStatusKeys =
    country === "USA" || country === "INDIA"
      ? ["firstStateDate", "thirdStateDate", "sixthStateDate"]
      : [
          "firstStateDate",
          "secondStateDate",
          "thirdStateDate",
          "fourthStateDate",
          "fifthStateDate",
          "sixthStateDate",
        ];

  if (!country || !trackingSteps[country] || !trackingStatus[country]) {
    return (
      <div>Error: Unsupported country or tracking information is missing.</div>
    );
  }

  const isBeforeDeliveredStatus =
    trackingInfo?.thirdStateDate && !trackingInfo?.sixthStateDate;

  return (
    <>
      {loading && (
        <div className="loader-container">
          <div className="loader-overlay">
            <img src={LOGOO} alt="Logo" className="loader-logo" />
            <PropagateLoader color={"#ff3c00"} loading={true} />
          </div>
        </div>
      )}

      {!loading && (
        <div id="trackmain">
          <Header />
          <div className="costomerTracking">
            <Link to="/ulogin">
              <button className="backorder">Back to Orders</button>
            </Link>
            <h2 style={{ fontSize: "20px" }}>Track Your Order</h2>
            <div>
              Order ID: <span style={{ fontWeight: "bold" }}>{orderId}</span>
            </div>
            <div>
              Product ID:{" "}
              <span style={{ fontWeight: "bold" }}>{productId}</span>
            </div>
            <div>
              Product Name:{" "}
              <span style={{ fontWeight: "bold" }}>
                {ProductName.join(" | ")}
              </span>
            </div>{" "}
            {/* Display Product Name */}
            {trackingInfo && (
              <>
                <div>
                  <p>
                    Estimated delivery date:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {formatDate(trackingInfo.estimatedDate)}
                    </span>
                  </p>
                </div>
                <div className="progress-bar">
                  {filteredStatusKeys.map((state, index) => (
                    <div
                      key={index}
                      className={`progress-step ${
                        trackingInfo[state] && isActiveStep(trackingInfo[state])
                          ? "active"
                          : ""
                      }`}
                    >
                      {trackingInfo[state] &&
                        isActiveStep(trackingInfo[state]) && (
                          <div className="costomerTracking_progress-details">
                            <br />
                            <div className="costomerTracking_step-status">
                              {trackingStatus[country][index]}
                            </div>
                            <div className="costomerTrackingDate">
                              {formatDate(trackingInfo[state])}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                <br />
                <div className="costomerTrackingDetails">
                  <h3 className="costomerTrackingDetails_h3">
                    Tracking Details
                  </h3>
                  <div className="costomerTracking_black-bar"></div>
                  {filteredStatusKeys.map((state, index) => (
                    <div key={index}>
                      {trackingInfo[state] &&
                        isActiveStep(trackingInfo[state]) && (
                          <div className="pkgspace">
                            {`● ${formatDate(
                              trackingInfo[state]
                            )} - Your package has${
                              trackingSteps[country][index]
                            }.`}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
                <div className="detailsTrackCont">
                  <div className="detailsTrack">
                    <h3>Shipping Address</h3>
                    <p>{address}</p>
                  </div>
                  <div className="detailsTrack">
                    <h3>Order Summary</h3>
                    <p>Total: Rs. {total}.00</p>
                    {/* <p>Product Name: {ProductName}</p> */}
                    <p>Quantity: {quantity.join(" , ")}</p>
                    <p>Size: {size.join(" | ")}</p>
                    <p>Color: {color.join(" | ")}</p>

                    {image && (
                      <div className="product-imageTrack">
                        <img
                          src={image}
                          alt="Product"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            <br />
            {isBeforeDeliveredStatus && (
              <button
                className="buttonTrackingin"
                onClick={handleDeliveredClick}
              >
                Mark as Delivered ✔
              </button>
            )}
            <div className="center-note" style={{ marginTop: "5%" }}>
              Note - If you have any concerns about tracking progress, feel free
              to contact the team via Email!
            </div>
          </div>
          <Footer />
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default CustomerTracking;
