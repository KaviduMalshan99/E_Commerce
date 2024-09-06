import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewPercentageChart.scss";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const ReviewPercentageChart = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [ratingPercentages, setRatingPercentages] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/reviewsByProductId/${productId}`
        );
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    if (reviews.length === 0) return;

    const totalReviews = reviews.length;
    const ratingCounts = reviews.reduce(
      (acc, review) => {
        const rating = review.Ratecount;
        if (rating >= 1 && rating <= 5) {
          acc[rating] += 1;
        }
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    const ratingPercentages = Object.keys(ratingCounts).reduce(
      (acc, rating) => {
        acc[rating] = (ratingCounts[rating] / totalReviews) * 100;
        return acc;
      },
      {}
    );

    const averageRating = (
      Object.keys(ratingCounts).reduce((sum, rating) => {
        return sum + ratingCounts[rating] * parseInt(rating, 10);
      }, 0) / totalReviews
    ).toFixed(1);

    setRatingPercentages(ratingPercentages);
    setAverageRating(averageRating);
  }, [reviews]);

  const renderStars = (rating) => {
    return (
      <div className="average-stars">
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className={`fa fa-star ${i < rating ? "filled" : "empty"}`}
            style={{ color: i < rating ? "#ffd900" : "#eee" }} // Gold for filled stars, grey for empty
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="review-chart-container">
      <div className="average-rating">
        <div className="average-rating-value">{averageRating}</div>
        {renderStars(averageRating)}
      </div>
      {/* <div className="cusreviewchart">Review Response by Star Rating</div> */}

      <div className="chart-section">
        <div className="cusreviewchart">Review Response by Star Rating</div>

        <div className="chart">
          {Object.keys(ratingPercentages).map((rating) => (
            <div key={rating} className="chart-row">
              <div className="bar">
                <div
                  className="bar-fill"
                  style={{ width: `${ratingPercentages[rating]}%` }}
                ></div>
              </div>
              <div className="stars">{renderStars(rating)}</div>
              <div className="percentage" style={{ fontSize: "15px" }}>
                {ratingPercentages[rating].toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPercentageChart;
