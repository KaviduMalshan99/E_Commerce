import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Userreviews.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthStore } from '../../src/store/useAuthStore';

const apiUrl = import.meta.env.VITE_BACKEND_API;

// StarRating Component
const StarRating = ({ rating, onRatingChange, editable }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (star) => {
    if (editable) {
      onRatingChange(star);
    }
  };

  const handleMouseEnter = (star) => {
    if (editable) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${starValue <= (hoverRating || rating) ? 'filled' : ''}`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

// Userreviews Component
const Userreviews = () => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [updatedReviewTitle, setUpdatedReviewTitle] = useState('');
  const [updatedReviewBody, setUpdatedReviewBody] = useState('');
  const [updatedRateCount, setUpdatedRateCount] = useState(0);
  const [updatedReviewImage, setUpdatedReviewImage] = useState([]);
  const [rateError, setRateError] = useState('');

  const fetchReviews = () => {
    const userId = user?.UserId;
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    axios.get(`${apiUrl}/api/reviews-with-products/${userId}`)
      .then(response => {
        const reviews = response.data.reviews || [];
        setReviews(reviews);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to fetch reviews');
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const handleDelete = (ReviewID) => {
    axios.delete(`${apiUrl}/api/deletereview/${ReviewID}`)
      .then(response => {
        const updatedReviews = reviews.filter(review => review.ReviewID !== ReviewID);
        setReviews(updatedReviews);
        toast.success('Review deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      });
  };

  const handleEdit = (review) => {
    setEditReview(review);
    setUpdatedReviewTitle(review.ReviewTitle);
    setUpdatedReviewBody(review.ReviewBody);
    setUpdatedRateCount(review.Ratecount);
    setUpdatedReviewImage(review.ReviewImage);
  };

  const handleUpdate = () => {
    if (!editReview || !editReview.ReviewID) {
      console.error('Cannot update review: ReviewID is missing or undefined');
      return;
    }

    const { ReviewID } = editReview;

    if (updatedRateCount < 1 || updatedRateCount > 5) {
      setRateError('Rating must be between 1 and 5');
      return;
    }

    const updateUrl = `${apiUrl}/api/updatereview/${ReviewID}`;

    axios.post(updateUrl, {
      ReviewTitle: updatedReviewTitle,
      ReviewBody: updatedReviewBody,
      Ratecount: updatedRateCount,
      ReviewImage: updatedReviewImage
    })
      .then(res => {
        const updatedReviews = reviews.map(prevReview =>
          prevReview.ReviewID === ReviewID ? {
            ...prevReview,
            ReviewTitle: updatedReviewTitle,
            ReviewBody: updatedReviewBody,
            Ratecount: updatedRateCount,
            ReviewImage: updatedReviewImage
          } : prevReview
        );
        setReviews(updatedReviews);
        setEditReview(null);
        toast.success('Review updated successfully');
      })
      .catch(err => {
        console.error('Error updating review:', err);
        toast.error('Failed to update review');
      });
  };

  const renderStars = (rateCount) => {
    const filledStars = rateCount;
    const emptyStars = 5 - rateCount;
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={i} className='star filled'>&#9733;</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={filledStars + i} className='star'>&#9734;</span>);
    }
    return stars;
  };

  return (
    <div className='ReviewUser_main'>
      <div className='ReviewUser_title'>
        <h1 style={{marginTop:'25px'}}>User Reviews</h1>
      </div>
      <div className='ReviewUser_container'>
        {reviews.length === 0 ? (
          <div className='no-reviews-message'>
            You have not added any Reviews
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.ReviewID} className='review-box'>
              <div className='review-content'>
                <div className='product-name'>
                  {review.ProductName}
                </div>
                <div className='review-header'>
                  <div className='review-title'>
                    <div className='review-title-header'>
                      <strong style={{color:'#ff9800'}}>Title:</strong>
                    </div>
                    {editReview === review ? (
                      <input type="text" value={updatedReviewTitle} onChange={e => setUpdatedReviewTitle(e.target.value)} />
                    ) : (
                      review.ReviewTitle
                    )}
                  </div>
                  <div className='review-rating'>
                    {editReview === review ? (
                      <>
                        <StarRating 
                          rating={updatedRateCount}
                          onRatingChange={rating => {
                            setUpdatedRateCount(rating);
                            setRateError('');
                          }}
                          editable={true}
                        />
                        {rateError && <span className="rate-error">{rateError}</span>}
                      </>
                    ) : (
                      renderStars(review.Ratecount)
                    )}
                  </div>
                </div>
                <div className='review-body'>
                  <div className='review-body-header'>
                    <strong style={{color:'#ff9800'}}>Description:</strong>
                  </div>
                  {editReview === review ? (
                    <textarea value={updatedReviewBody} onChange={e => setUpdatedReviewBody(e.target.value)} />
                  ) : (
                    review.ReviewBody
                  )}
                </div>
                <div className='review-images'>
                  {review.ReviewImage.map((image, index) => (
                    <img key={index} src={image} alt={`Review Image ${index}`} className="review-image" />
                  ))}
                </div>
                <div className="review-actions">
                  {editReview === review ? (
                    <>
                      <button className='ReviewUser_save' onClick={handleUpdate}>Save</button>
                      <button className='ReviewUser_cancel' onClick={() => setEditReview(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className='ReviewUser_Edit' onClick={() => handleEdit(review)}>Edit</button>
                      <button className='ReviewUser_Delete' onClick={() => handleDelete(review.ReviewID)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );  
};

export default Userreviews;
