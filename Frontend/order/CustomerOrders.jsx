import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CusOrder.scss";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import "../customer response/Rating.scss";
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import AddOrderCancellation from "../tracking/AddOrderCancellation";

const apiUrl = import.meta.env.VITE_BACKEND_API;

function CustomerOrders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState({});
  const userId = user?.UserId;
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [imageValidationError, setImageValidationError] = useState("");
  const formRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleOrders, setVisibleOrders] = useState({});

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      closeForm();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3001/api/orders/customer/${userId}`)
        .then((response) => {
          const groupedOrders = groupOrdersByMonth(response.data);
          setOrders(groupedOrders);
          setVisibleOrders(groupedOrders);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Error fetching orders:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const generateUniqueID = () => {
    return "_" + Math.random().toString(36).substr(2, 9); // Generate a random string
  };

  const handleReviewOrder = (orderId, customerId, productId) => {
    setSelectedOrder(orderId);
    setCustomerId(customerId);
    setProductId(productId);
    setIsFormOpen(true);
    setShowPopup(true);
  };

  const submitReview = () => {
    if (!selectedOrder) return;

    const reviewID = generateUniqueID();

    if (name.trim() === "") {
      setNameError("Name is required");
      return;
    }

    if (email.trim() === "") {
      setEmailError("Email is required");
      return;
    }

    if (reviewTitle.trim() === "") {
      setTitleError("Review title is required");
      return;
    }

    const reviewData = {
      ReviewID: reviewID,
      customerId: customerId,
      ProductId: productId,
      CustomerName: name,
      CustomerEmail: email,
      Ratecount: rating,
      ReviewTitle: reviewTitle,
      ReviewBody: reviewBody,
      ReviewImage: imagePreview,
      Date: new Date().toISOString(),
    };

    axios
      .post(`http://localhost:3001/api/addReviews`, reviewData)
      .then((response) => {
        console.log("Review added successfully:", response.data);
        closeForm();
        clearForm();
        toast.success("Review submitted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        toast.error("Failed to submit review. Please try again later.");
      });
  };

  const handleTrackOrder = (
    orderId,
    productId,
    country,
    image,
    ProductName,
    address,
    quantity,
    total,
    size,
    color
  ) => {
    navigate(`/tracking/${orderId}/${productId}`, {
      state: {
        country,
        image: image[0],
        ProductName,
        address,
        quantity,
        total,
        size,
        color,
      },
    });
  };

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    setNameError("");
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError("");
  };

  const handleTitleChange = (event) => {
    setReviewTitle(event.target.value);
    setTitleError("");
  };

  const handleReviewBodyChange = (event) => {
    setReviewBody(event.target.value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const maxPreviews = 3;

    if (imagePreview.length + files.length > maxPreviews) {
      setImageValidationError("You can only add up to three images");
      return;
    }

    const imageUrls = [];

    for (
      let i = 0;
      i < Math.min(files.length, maxPreviews - imagePreview.length);
      i++
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrls.push(reader.result);
        setImagePreview((prevState) => [...prevState, reader.result]);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  useEffect(() => {
    if (isFormOpen) {
      const fullName = `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.trim();
      setName(fullName);
      setEmail(user?.email || "");
    }
  }, [isFormOpen, user]);

  const openForm = (orderId) => {
    setSelectedOrder(orderId);
    setIsFormOpen(true);
    setShowPopup(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    clearForm();
    setShowPopup(false);
    setShowCancellationForm(false);
  };

  const clearForm = () => {
    setRating(0);
    setName("");
    setEmail("");
    setReviewTitle("");
    setReviewBody("");
    setNameError("");
    setEmailError("");
    setTitleError("");
    setImagePreview([]);
    setImageValidationError("");
    setSelectedOrder(null);
  };

  function groupOrdersByMonth(orders) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return orders.reduce((acc, order) => {
      const date = new Date(order.orderDate);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(order);
      return acc;
    }, {});
  }

  const handleCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
    setShowCancellationForm(true);
    setShowPopup(true);
  };

  const isCancellable = (orderDate) => {
    const orderDateTime = new Date(orderDate).getTime();
    const currentDateTime = new Date().getTime();
    const differenceInTime = currentDateTime - orderDateTime;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 2;
  };

  const isTrackable = (orderDate) => {
    const orderDateTime = new Date(orderDate).getTime();
    const currentDateTime = new Date().getTime();
    const differenceInTime = currentDateTime - orderDateTime;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays > 2;
  };

  const handleShowMore = (monthYear) => {
    setVisibleOrders((prevVisibleOrders) => ({
      ...prevVisibleOrders,
      [monthYear]: orders[monthYear],
    }));
  };

  return (
    <div className={`orders-list ${showPopup ? "blur-background" : ""}`}>
      <h1 className="page-title">YOUR ORDERS</h1>
      {isLoading ? (
        <div className="loading-message">
          <p>Loading your orders, please wait...</p>
          {!userId && (
            <p>
              If you haven't logged in or registered yet, please{" "}
              <Link to="/login">Log in</Link> or{" "}
              <Link to="/register">Register</Link> to view your orders.
            </p>
          )}
        </div>
      ) : (
        <>
          {Object.entries(visibleOrders).map(([monthYear, ordersInMonth]) => (
            <div key={monthYear}>
              <h3>{monthYear}</h3>
              <div className="orders-container">
                {ordersInMonth.slice(0, 3).map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-info">
                      <h5>Order #{order.orderId}</h5>
                      <p>
                        Placed on{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-content">
                      <div className="order-details">
                        {order.products.map((product, index) => (
                          <div key={index} className="product-details">
                            <div className="product-info"></div>
                            <div className="product-image">
                              <img
                                src={
                                  Array.isArray(product.image)
                                    ? product.image[0]
                                    : product.image
                                }
                                alt={product.ProductName}
                              />
                            </div>
                            <div className="product-info">
                              <p className="product-name">
                                {product.ProductName}
                              </p>
                              <p className="product-quantity">
                                Quantity: {product.quantity}
                              </p>
                              <p className="product-size">
                                Size: {product.size}
                              </p>
                              <p className="product-color">
                                Color: {product.color}
                              </p>
                              <p className="product-price">
                                Price: {product.price}
                              </p>
                              <button
                                className="revieww"
                                onClick={() =>
                                  handleReviewOrder(
                                    order.orderId,
                                    order.customerId,
                                    product.productId
                                  )
                                }
                              >
                                Add Review
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-actions">
                        {isTrackable(order.orderDate) && (
                          <button
                            className="tracking-button"
                            onClick={() =>
                              handleTrackOrder(
                                order.orderId,
                                // order.products[0].productId,
                                order.products.map(
                                  (product) => product.productId
                                ),
                                order.country,
                                order.products.map((product) => product.image),
                                order.products.map(
                                  (product) => product.ProductName
                                ),
                                order.address,
                                order.products.map(
                                  (product) => product.quantity
                                ),
                                order.total,
                                order.products.map((product) => product.size),
                                order.products.map((product) => product.color)
                              )
                            }
                          >
                            Track
                          </button>
                        )}
                        {isCancellable(order.orderDate) && (
                          <button
                            className="cancelorderbtn"
                            onClick={() => handleCancelOrder(order.orderId)}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                    {selectedOrder === order.orderId && isFormOpen && (
                      <div className="form-overlay">
                        <div className="ratingpopupform" ref={formRef}>
                          <h2>
                            <u>Add Review</u>
                          </h2>
                          <h3>Write the review</h3>

                          <div className="ratingform-element">
                            <label htmlFor="name">Name</label>
                            <input
                              type="text"
                              id="name"
                              autoComplete="name"
                              placeholder="Enter your name"
                              value={name}
                              onChange={handleNameChange}
                            />
                            {nameError && (
                              <span className="error-message">{nameError}</span>
                            )}
                          </div>

                          <div className="ratingform-element">
                            <label htmlFor="email">Email</label>
                            <input
                              type="text"
                              id="email"
                              autoComplete="email"
                              placeholder="johnsmith@example.com"
                              value={email}
                              onChange={handleEmailChange}
                            />
                            {emailError && (
                              <span className="error-message">
                                {emailError}
                              </span>
                            )}
                          </div>

                          <label htmlFor="rating" className="ratestar">
                            Rating
                          </label>
                          <div className="ratingform-element">
                            {[...Array(5)].map((_, index) => (
                              <FaStar
                                key={index}
                                className="stars"
                                onClick={() => handleStarClick(index)}
                                color={index < rating ? "#ffc107" : "#e4e5e9"}
                              />
                            ))}
                          </div>

                          <div className="ratingform-element">
                            <label htmlFor="reviewTitle">Review Title</label>
                            <input
                              type="text"
                              id="reviewTitle"
                              placeholder="Give a review title"
                              value={reviewTitle}
                              onChange={handleTitleChange}
                            />
                            {titleError && (
                              <span className="rate-error-message">
                                {titleError}
                              </span>
                            )}
                          </div>

                          <div className="ratingform-element">
                            <label htmlFor="reviewBody">Body of Review</label>
                            <textarea
                              id="reviewBody"
                              cols="40"
                              rows="5"
                              placeholder="Write your comments here"
                              value={reviewBody}
                              onChange={handleReviewBodyChange}
                            ></textarea>
                          </div>

                          <div className="ratingform-element">
                            <label htmlFor="reviewBody">Add image</label>
                            <input
                              type="file"
                              accept="image/*"
                              className="Reviewimg"
                              onChange={handleFileChange}
                            />
                            <div className="images-preview-containers">
                              {imagePreview.map((imagePreviewUrl, index) => (
                                <img
                                  key={index}
                                  src={imagePreviewUrl}
                                  alt={`Preview ${index}`}
                                  className="preview-images"
                                />
                              ))}
                              {imagePreview.length >= 3 && (
                                <span className="rate-error-message">
                                  {imageValidationError}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="submit-btn">
                            <button
                              className="ratingsubbtn2"
                              onClick={submitReview}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {ordersInMonth.length > 3 &&
                  visibleOrders[monthYear].length === 3 && (
                    <button
                      className="show-more-button"
                      onClick={() => handleShowMore(monthYear)}
                    >
                      Show More
                    </button>
                  )}
              </div>
            </div>
          ))}
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default CustomerOrders;
