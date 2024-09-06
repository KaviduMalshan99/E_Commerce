import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_BACKEND_API;

function AddAdmin() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    rePassword: "",
    privacyPolicy: false,
    role: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      toast.error("Passwords Mismatched");
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
        role: "",
      });
      setError("");
      toast.success("User registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while registering.");
    }
  };

  return (
    <div>
      <div className="regmtitle">ADMIN REGISTRATION</div>
      <div className="uregmallitems">
        <form onSubmit={handleSubmit}>
          <div className="regfitems">
            <div>
              <input
                className="regfminputs"
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
              <input
                className="regfminputs"
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
              <input
                className="regfminputs"
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
              <input
                className="regfminputs"
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
              <input
                className="regfminputs"
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
              <input
                className="regfminputs"
                type="password"
                id="rePassword"
                name="rePassword"
                placeholder="Re-Enter Password"
                value={formData.rePassword}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <select
                className="regfminputs"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <button type="submit" className="remubtn">
              Register
            </button>
            Already have an account? Login
          </div>
        </form>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}

export default AddAdmin;
