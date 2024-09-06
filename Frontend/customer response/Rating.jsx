import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Review = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [imageValidationError, setImageValidationError] = useState("");

  const formRef = useRef(null);

  const generateUniqueID = () => {
    return "_" + Math.random().toString(36).substr(2, 9); // Generate a random string
  };

  const submitReview = () => {
    const reviewID = generateUniqueID();

    // Validate name, email, and review title
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

    // Prepare data to send to the server
    const reviewData = {
      ReviewID: reviewID,
      CustomerName: name,
      CustomerEmail: email,
      Ratecount: rating,
      ReviewTitle: reviewTitle,
      ReviewBody: reviewBody,
      ReviewImage: imagePreview,
      Date: new Date().toISOString(), // Current date in ISO format
    };

    // Send POST request to server endpoint
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

    const imagePreviewsArray = [];

    for (
      let i = 0;
      i < Math.min(files.length, maxPreviews - imagePreview.length);
      i++
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imagePreviewsArray.push(reader.result);
        setImagePreview((prevState) => [...prevState, reader.result]);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    clearForm();
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
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeForm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="main4">
      <div className="center">
        <button className="btn1" onClick={openForm}>
          Write a Review
        </button>
      </div>
      {isFormOpen && (
        <div className="popupform" ref={formRef}>
          <h2>
            <u>Add Review</u>
          </h2>
          <h3>Write the review</h3>

          <div className="form-element">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              autoComplete="name"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
            />
            {nameError && <span className="error-message">{nameError}</span>}
          </div>

          <div className="form-element">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              autoComplete="email"
              placeholder="johnsmith@example.com"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <label htmlFor="rating" className="rate">
            Rating
          </label>
          <div className="rating">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className="star"
                onClick={() => handleStarClick(index)}
                color={index < rating ? "#ffc107" : "#e4e5e9"}
              />
            ))}
          </div>

          <div className="form-element">
            <label htmlFor="reviewTitle">Review Title</label>
            <input
              type="text"
              id="reviewTitle"
              placeholder="Give a review title"
              value={reviewTitle}
              onChange={handleTitleChange}
            />
            {titleError && <span className="error-message">{titleError}</span>}
          </div>

          <div className="form-element">
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

          <div className="form-element">
            <label htmlFor="reviewBody">Add image</label>
            <input
              type="file"
              accept="image/*"
              className="Reviewimg"
              onChange={handleFileChange}
            />
            <div className="image-preview-container">
              {imagePreview.map((imagePreviewUrl, index) => (
                <img
                  key={index}
                  src={imagePreviewUrl}
                  alt={`Preview ${index}`}
                  className="preview-image"
                />
              ))}
              {imagePreview.length >= 3 && (
                <span className="error-message">{imageValidationError}</span>
              )}
            </div>
          </div>

          <div className="submit-btn">
            <button className="btn2" onClick={submitReview}>
              Submit
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Review;
