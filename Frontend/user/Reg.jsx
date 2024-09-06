import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.scss";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Reg = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    rePassword: "",
    privacyPolicy: false,
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      toast.error("Passwords Missmatched");
      return;
    }

    try {
      if (!formData.privacyPolicy) {
        setError("Please accept the privacy policy.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3001/api/register`,
        formData
      );
      console.log("Response:", response.data.customer);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        password: "",
        rePassword: "",
        privacyPolicy: false,
      });
      setError("");
      toast.success("User registered successfully!");
      navigate(`/login`);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while registering.");
    }
  };

  return (
    <div>
      <Header />
      <div className="registration-title">REGISTRATION</div>
      <div className="registration-container">
        <form onSubmit={handleSubmit}>
          <div className="registration-form-items">
            <div>
              <span>First Name :</span>
              <input
                className="registration-input"
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <span>Last Name :</span>
              <input
                className="registration-input"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <span>Email :</span>
              <input
                className="registration-input"
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <span>Contact :</span>
              <input
                className="registration-input"
                type="tel"
                id="contact"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <span>Password :</span>
              <input
                className="registration-input"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <span>Confirm Password :</span>
              <input
                className="registration-input"
                type="password"
                id="rePassword"
                name="rePassword"
                placeholder="Re-Enter Password"
                value={formData.rePassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="registration-policy-check">
              <input
                type="checkbox"
                name="privacyPolicy"
                checked={formData.privacyPolicy}
                onChange={handleChange}
                required
              />
              <div className="policy-label"> Accept privacy & Policy</div>
            </div>
            <button type="submit" className="registration-button">
              Register
            </button>
            <div className="login-link-text">
              Already have an account?{" "}
              <Link className="login-link-login" to="/login">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Reg;
