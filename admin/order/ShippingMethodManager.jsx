import React, { useState, useEffect } from "react";
import axios from "axios";
import "./shipping.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_BACKEND_API;

function ShippingMethodManager() {
  const [methods, setMethods] = useState([]);
  const [methodName, setMethodName] = useState("");
  const [price, setPrice] = useState("");
  const [country, setCountry] = useState("");
  const [editingMethodId, setEditingMethodId] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/shippingMethods`
      );
      setMethods(data);
    } catch (error) {
      toast.error("Failed to fetch shipping methods.");
    }
  };

  const handleAddOrUpdate = async () => {
    if (editingMethodId) {
      await handleUpdate(editingMethodId);
    } else {
      await handleAdd();
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`http://localhost:3001/api/shippingMethods`, {
        methodName,
        price,
        country,
      });
      fetchMethods();
      setMethodName("");
      setPrice("");
      setCountry("");
      toast.success("Shipping method added successfully.");
    } catch (error) {
      toast.error("Failed to add shipping method.");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/shippingMethods/${id}`, {
        methodName,
        price,
        country,
      });
      fetchMethods();
      setMethodName("");
      setPrice("");
      setCountry("");
      setEditingMethodId(null);
      toast.success("Shipping method updated successfully.");
    } catch (error) {
      toast.error("Failed to update shipping method.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/shippingMethods/${id}`);
      fetchMethods();
      toast.success("Shipping method deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete shipping method.");
    }
  };

  const handleEdit = (method) => {
    setMethodName(method.methodName);
    setPrice(method.price);
    setCountry(method.country);
    setEditingMethodId(method._id);
  };

  return (
    <div className="shipping-method-manager">
      <h2>Manage Shipping Methods</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Method Name"
          value={methodName}
          onChange={(e) => setMethodName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select Country</option>
          <option value="Sri Lanka">Sri Lanka</option>
          <option value="USA">USA</option>
          <option value="India">India</option>
        </select>
        <button onClick={handleAddOrUpdate}>
          {editingMethodId
            ? "Update Shipping Method"
            : "Add New Shipping Method"}
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Method Name</th>
              <th>Country</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method) => (
              <tr key={method._id}>
                <td>{method.methodName}</td>
                <td>{method.country}</td>
                <td>
                  {method.country === "Sri Lanka" ? "LKR" : "$"} {method.price}
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(method)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(method._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ShippingMethodManager;
