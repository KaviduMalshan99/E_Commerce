import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcceptedReviews.scss";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const AcceptedReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    axios
      .get(`http://localhost:3001/api/acceptreviews`)
      .then((response) => {
        console.log("Fetched reviews:", response.data.response);
        const reviewsWithFormattedDate = response.data.response.map(
          (review) => ({
            ...review,
            Date: moment(review.Date)
              .utcOffset("+05:30")
              .format("YYYY-MM-DD HH:mm:ss"),
          })
        );
        setReviews(reviewsWithFormattedDate);
      })
      .catch((error) => {
        console.error("Error fetching review data:", error);
      });
  };

  const openReviewModal = (reviewID) => {
    console.log("Opening review modal for ID:", reviewID);
    axios
      .get(`http://localhost:3001/api/acceptedreviews/${reviewID}`)
      .then((response) => {
        console.log("Fetched review data:", response.data);
        setSelectedReview(response.data.review);
        setShowForm(true);
      })
      .catch((error) => {
        console.error("Error fetching review data:", error);
        if (error.response) {
          if (error.response.status === 404) {
            alert("Review not found");
          } else {
            alert(
              `Error: ${error.response.status} - ${error.response.statusText}`
            );
          }
        } else {
          alert("Error fetching review data");
        }
      });
  };

  const handleRemove = () => {
    if (!selectedReview || !selectedReview.ReviewID) return;

    const reviewID = selectedReview.ReviewID;

    axios
      .delete(`http://localhost:3001/api/acceptdelete/${reviewID}`)
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

  const renderStarRating = (ratingCount) => {
    const maxStars = 5;
    const filledStars = Math.round(ratingCount);
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
      if (i < filledStars) {
        stars.push(<span key={i}>&#9733;</span>);
      } else {
        stars.push(<span key={i}>&#9734;</span>);
      }
    }

    return stars;
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedReview(null);
  };

  return (
    <div className="AcceptedReviews_main">
      <button className="productnav" onClick={() => navigate(-1)}>
        Back
      </button>
      <table className="AcceptedReviews_table">
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
                    className="View_Review"
                    onClick={() => openReviewModal(review.ReviewID)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No reviews found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && selectedReview && (
        <div className="popupreviewform">
          <h2>
            <u>Added Review</u>
          </h2>
          <h3>View the review</h3>
          <form>
            <div className="reviewform-element">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={selectedReview.CustomerName}
                disabled
              />
            </div>
            <div className="reviewform-element">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={selectedReview.CustomerEmail}
                disabled
              />
            </div>
            <div className="reviewform-element">
              <label htmlFor="rating">Rating</label>
              <br />
              <div className="ratingstars">
                {renderStarRating(selectedReview.Ratecount)}
              </div>
            </div>
            <div className="reviewform-element">
              <label htmlFor="reviewTitle">Review Title</label>
              <input
                type="text"
                id="reviewTitle"
                value={selectedReview.ReviewTitle}
                disabled
              />
            </div>
            <div className="reviewform-element">
              <label htmlFor="reviewBody">Body of Review</label>
              <textarea
                id="reviewBody"
                cols="40"
                rows="5"
                value={selectedReview.ReviewBody}
                disabled
              />
            </div>
            <div className="reviewform-element">
              <label htmlFor="reviewImages">Review Images</label>
              <br />
              <div className="review-images-container">
                {selectedReview.ReviewImage &&
                selectedReview.ReviewImage.length > 0 ? (
                  selectedReview.ReviewImage.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      style={{ borderRadius: "5px" }}
                    />
                  ))
                ) : (
                  <p>No images uploaded for this review.</p>
                )}
              </div>
              <div className="Remove-btn">
                <button className="btn3" onClick={handleRemove}>
                  Remove
                </button>
              </div>
            </div>
          </form>
          <button className="close-btn" onClick={closeForm}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default AcceptedReviews;
