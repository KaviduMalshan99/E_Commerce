import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductReviews.scss";
import { useNavigate, useParams, Link } from "react-router-dom"; // Import Link from react-router-dom
import { ToastContainer, toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const ProductReviews = () => {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Product ID:", productId); // Log productId
    const fetchReviews = async () => {
      try {
        // Check if productId is available
        if (productId) {
          const reviewsResponse = await axios.get(
            `http://localhost:3001/api/reviewsByProductId/${productId}`
          );

          // Filter reviews based on the productId
          const filteredReviews = reviewsResponse.data.reviews;

          setReviews(filteredReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  const openReviewModal = (reviewID) => {
    axios
      .get(`http://localhost:3001/api/review/${reviewID}`)
      .then((response) => {
        console.log("Retrieved review data:", response.data);
        setSelectedReview(response.data); // Assuming response.data is an object containing review data
        setShowForm(true); // Show the form
      })
      .catch((error) => {
        console.error("Error fetching review data:", error);
        if (error.response && error.response.status === 404) {
          alert("Review not found");
        }
      });
  };

  const renderStarRating = (ratingCount) => {
    const maxStars = 5;
    const filledStars = Math.round(ratingCount);
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
      if (i < filledStars) {
        stars.push(<span key={i}>&#9733;</span>); // Filled star
      } else {
        stars.push(<span key={i}>&#9734;</span>); // Empty star
      }
    }

    return stars;
  };

  const closeForm = () => {
    setShowForm(false); // Hide the form
    setSelectedReview(null); // Reset selected review
  };

  const handleRemove = () => {
    if (!selectedReview || !selectedReview.review) return;

    const reviewID = selectedReview.review.ReviewID;

    axios
      .delete(`http://localhost:3001/api/deletereview/${reviewID}`)
      .then((response) => {
        console.log("Review deleted successfully:", response.data);
        const updatedReviews = reviews.filter(
          (review) => review.ReviewID !== reviewID
        );
        setReviews(updatedReviews);
        setShowForm(false);
        setSelectedReview(null);
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
        alert("Failed to delete review. Please try again.");
      });
  };

  return (
    <div className="ProductReviews_main">
      <ToastContainer />

      {/* Back button */}
      <button
        onClick={() => navigate("/admin/rating")}
        style={{
          width: "60%",
          maxWidth: "200px",
          margin: "20px auto",
          display: "block",
          backgroundColor: "#07223D",
          color: "#FFFFFF",
          padding: "12px 24px",
          fontSize: "18px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          marginLeft: "-2px",
        }}
      >
        Back to Main
      </button>

      <div className="ProductReviews_table-container">
        <table className="ProductReviews_table">
          <thead>
            <tr>
              <th className="review_theader2">ReviewID</th>
              <th className="review_theader3">ProductID</th>
              <th className="review_theader4">Date</th>
              <th className="review_theader5">CustomerID</th>
              <th className="review_theader6">Customer Name</th>
              <th className="review_theader7">Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.ReviewID}>
                  <td>{review.ReviewID}</td>
                  <td>{review.ProductId}</td>
                  <td>{review.Date}</td>
                  <td>{review.customerId}</td>
                  <td>{review.CustomerName}</td>
                  <td>
                    <button
                      className="Review_viewmore"
                      onClick={() => openReviewModal(review.ReviewID)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No reviews found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && selectedReview && (
        <div className="popupform">
          <h2>
            <u>Added Review</u>
          </h2>
          <h3>View the review</h3>
          <form>
            <div className="form-element">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={selectedReview.review.CustomerName}
                disabled
              />
            </div>
            <div className="form-element">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={selectedReview.review.CustomerEmail}
                disabled
              />
            </div>
            <div className="form-element">
              <label htmlFor="rating">Rating</label>
              <br />
              <div className="stars">
                {renderStarRating(selectedReview.review.Ratecount)}
              </div>
            </div>
            <div className="form-element">
              <label htmlFor="reviewTitle">Review Title</label>
              <input
                type="text"
                id="reviewTitle"
                value={selectedReview.review.ReviewTitle}
                disabled
              />
            </div>
            <div className="form-element">
              <label htmlFor="reviewBody">Body of Review</label>
              <textarea
                name="options"
                id="reviewBody"
                cols="40"
                rows="5"
                value={selectedReview.review.ReviewBody}
                disabled
              />
            </div>
            <div className="form-element">
              <label htmlFor="reviewImage">Review Images</label>
              <br />
              {selectedReview.review.ReviewImage &&
              selectedReview.review.ReviewImage.length > 0 ? (
                <div className="review-images-container">
                  {selectedReview.review.ReviewImage.map((image, index) => (
                    <img key={index} src={image} alt={`Review ${index + 1}`} />
                  ))}
                </div>
              ) : (
                <p>No images uploaded for this review.</p>
              )}
            </div>
            <div className="review-btn-container">
              <center>
                <div className="Accept-btn">
                  {/* <Link to={'/admin/productreviews'}>
                    <button className="btn2" onClick={() => handleAccept(selectedReview?.review?.ReviewID)}>Accept</button>
                  </Link> */}
                  <button className="btn2" onClick={closeForm}>
                    Cancel
                  </button>
                </div>
                <div className="Remove-btn">
                  <button className="btn3" onClick={handleRemove}>
                    Remove
                  </button>
                </div>
              </center>
            </div>
          </form>
          <button value="X" className="prorevclose-btn" onClick={closeForm}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
