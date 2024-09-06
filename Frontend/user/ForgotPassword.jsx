import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ForgotPassword.scss";
import AuthAPI from "../../src/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { errorMessage, successMessage } from "../../src/utils/Alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  //
  const { mutate, isLoading } = useMutation({
    mutationFn: AuthAPI.forgotPassword,
    onSuccess: (res) => {
      successMessage("Success", "Password reset link sent to your email.");
    },
    onError: (err) => {
      errorMessage("Error", "Something went wrong. Please try again.");
    },
  });
  //
  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!email) {
      isValid = false;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = "Email is invalid";
    }

    setErrors(errors);
    return isValid;
  };
  //
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate({ email });
    }
  };
  return (
    <div>
      <Header />
      <div className="reset-password-container">
        <div>
          <h1 className="reset-password-title">Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="reset-password-form-items">
              <input
                type="email"
                className={`reset-password-input ${errors.email ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
              <button type="submit" className="reset-password-button" disabled={isLoading}>
                {isLoading ? "Loading..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default ForgotPassword;
