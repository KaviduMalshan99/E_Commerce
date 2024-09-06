import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AuthAPI from "../../src/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { errorMessage, successMessage } from "../../src/utils/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.scss";


const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the token from the query string
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!password) {
      isValid = false;
      errors.password = "Password is required";
    } else if (password.length < 6) {
      // Example: Minimum length check
      isValid = false;
      errors.password = "Password must be at least 6 characters";
    }

    // confirm password
    if (!confirmPassword) {
      isValid = false;
      errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword.length < 6) {
      // Example: Minimum length check
      isValid = false;
      errors.confirmPassword = "Confirm Password must be at least 6 characters";
    } else if (confirmPassword !== password) {
      isValid = false;
      errors.confirmPassword = "Confirm Password must match with Password";
    }

    // token
    if (!token) {
      isValid = false;
      errorMessage("Error", "Invalid token");
    }

    setErrors(errors);
    return isValid;
  };

  const redirectToLogin = (res) => {
    navigate("/login");
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: AuthAPI.resetPassword,
    onSuccess: (res) => {
      successMessage("Success", res.data.message, () => {
        redirectToLogin(res);
      });
    },
    onError: (err) => {
      errorMessage("Error", err.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate({ token, password });
    }
  };

  return (
    <div>
      <Header />
      <h1 className="reset-title">Create New Password</h1>
      <div className="reset-container">
        <form onSubmit={handleSubmit}>
          <div className="reset-form-items">
            <input
              type="password"
              className={`reset-input ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
            <input
              type="password"
              className={`reset-input ${errors.confirmPassword ? "is-invalid" : ""}`}
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
            <button type="submit" className="reset-button" disabled={isLoading}>
              {isLoading ? "Loading..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
