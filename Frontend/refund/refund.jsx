import React, { useState } from "react";
import Footer from "../Footer/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./refundNow.scss";
import { useNavigate, Link } from "react-router-dom";
import Header from "../Header/Header";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Refund = () => {
  const [newRefund, setNewRefund] = useState({
    orderId: "",
    productIds: [],
    customerName: "",
    customerEmail: "",
    reason: "",
    imgUrls: [],
  });
  const [currentProductId, setCurrentProductId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "refundDate") {
      const selectedDate = new Date(value);
      const currentTime = new Date();
      selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes());
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: selectedDate,
      }));
    } else if (name === "customerName") {
      const isValid = /^[a-zA-Z\s]*$/.test(value);
      if (!isValid) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only letters and spaces are allowed",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: value,
      }));
    } else {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: value,
      }));
    }
  };

  const handleProductIdChange = (e) => {
    setCurrentProductId(e.target.value);
  };

  const addProductId = () => {
    if (currentProductId.trim()) {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        productIds: [...prevRefund.productIds, currentProductId.trim()],
      }));
      setCurrentProductId(""); // Clear the input field
    }
  };

  const removeProductId = (index) => {
    setNewRefund((prevRefund) => {
      const updatedProductIds = [...prevRefund.productIds];
      updatedProductIds.splice(index, 1);
      return {
        ...prevRefund,
        productIds: updatedProductIds,
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    const orderIdRegex = /^[a-zA-Z0-9]+$/;
    const customerNameRegex = /^[a-zA-Z0-9\s]+$/;

    if (!newRefund.orderId.trim()) {
      errors.orderId = "Order ID is required";
    } else if (!orderIdRegex.test(newRefund.orderId)) {
      errors.orderId = "Order ID must contain only characters and numbers";
    }

    if (!newRefund.customerName.trim()) {
      errors.customerName = "Customer Name is required";
    } else if (!customerNameRegex.test(newRefund.customerName)) {
      errors.customerName =
        "Customer Name must contain only characters, numbers, and spaces";
    }

    if (!newRefund.customerEmail.trim()) {
      errors.customerEmail = "Customer Email is required";
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        newRefund.customerEmail
      )
    ) {
      errors.customerEmail = "Invalid email format";
    }

    if (!newRefund.reason.trim()) {
      errors.reason = "Reason is required";
    }

    setErrors(errors);
    return errors;
  };

  // const handleChangeImage = (event) => {
  //     const imageFile = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //         const base64String = reader.result;
  //         setImagePreview(base64String);
  //         setNewRefund((prevRefund) => ({
  //             ...prevRefund,
  //             imgUrls: [base64String]
  //         }));
  //     };
  //     reader.readAsDataURL(imageFile);
  // };

  const [imagePreviews, setImagePreviews] = useState([]); // For multiple image previews

  const handleChangeImage = (event) => {
    const files = Array.from(event.target.files);
    const updatedImgUrls = [];
    const updatedImagePreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        updatedImgUrls.push(base64String);
        updatedImagePreviews.push(base64String);

        if (updatedImgUrls.length === files.length) {
          setNewRefund((prevRefund) => ({
            ...prevRefund,
            imgUrls: [...prevRefund.imgUrls, ...updatedImgUrls],
          }));
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            ...updatedImagePreviews,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddRefund = (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      axios
        .post(`http://localhost:3001/api/addrefund`, newRefund)
        .then((response) => {
          toast.success("Refund added successfully!");
          setNewRefund({
            orderId: "",
            productIds: [],
            customerName: "",
            customerEmail: "",
            reason: "",
            imgUrls: [],
          });
          navigate(`/refundedit/${newRefund.orderId}`);
        })
        .catch((error) => {
          console.error("Error adding refund: ", error);
          toast.error("Error adding refund. Please try again.");
        });
    } else {
      toast.error("Please fill out all required fields correctly.");
    }
  };

  return (
    <div className="refund-main">
      <Header />
      <div className="rnmh">Refund</div>
      <div className="rnlp">Home &gt; Refund</div>
      <div className="rnmbtnss">
        <button
          id="transparent-buttonrr"
          onClick={() => navigate(`/refundPolicy`)}
        >
          Refund Policy
        </button>
        <div className="iraa">{" | "}</div>
        <button id="transparent-buttonrr" onClick={() => navigate(`/refund`)}>
          Refund Now
        </button>
      </div>
      <center>
        <div id="rnmcont">
          <form onSubmit={handleAddRefund}>
            <table className="rnmcon">
              <tbody>
                <tr className="rnmconttd">
                  <td className="rnmconttd">
                    <div className="rnmcontit">Order ID</div>
                  </td>
                  <td className="rnmconttd">
                    <input
                      type="text"
                      className="rnmconinp"
                      name="orderId"
                      placeholder="Enter Order ID"
                      value={newRefund.orderId}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.orderId && (
                      <div className="error-message">{errors.orderId}</div>
                    )}
                  </td>
                </tr>
                <tr className="rnmconttd">
                  <td className="rnmconttd">
                    <div className="rnmcontit">Product IDs</div>
                  </td>
                  <td className="rnmconttd">
                    <input
                      type="text"
                      className="rnmconinp"
                      name="productId"
                      placeholder="Enter Product ID"
                      value={currentProductId}
                      onChange={handleProductIdChange}
                    />
                    <button
                      type="button"
                      className="addProbtn"
                      onClick={addProductId}
                    >
                      Add Product ID
                    </button>
                    {newRefund.productIds.length > 0 &&
                      newRefund.productIds.map((productId, index) => (
                        <div
                          style={{ marginLeft: "1%", marginTop: "1%" }}
                          key={index}
                        >
                          {productId}
                          <button
                            type="button"
                            className="product-id-item"
                            onClick={() => removeProductId(index)}
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    {errors.productIds && (
                      <div className="error-message">{errors.productIds}</div>
                    )}
                  </td>
                </tr>
                <tr className="rnmconttd">
                  <td className="rnmconttd">
                    <div className="rnmcontit">Customer Name</div>
                  </td>
                  <td className="rnmconttd">
                    <input
                      type="text"
                      className="rnmconinp"
                      name="customerName"
                      placeholder="Enter Name"
                      value={newRefund.customerName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.customerName && (
                      <div className="error-message">{errors.customerName}</div>
                    )}
                  </td>
                </tr>
                <tr className="rnmconttd">
                  <td className="rnmconttd">
                    <div className="rnmcontit">Customer Email</div>
                  </td>
                  <td className="rnmconttd">
                    <input
                      type="email"
                      className="rnmconinp"
                      name="customerEmail"
                      placeholder="Enter Email"
                      value={newRefund.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.customerEmail && (
                      <div className="error-message">
                        {errors.customerEmail}
                      </div>
                    )}
                  </td>
                </tr>
                <tr className="rnmconttd">
                  <td className="rnmconttd">
                    <div className="rnmcontit">Reason</div>
                  </td>
                  <td>
                    <textarea
                      className="rn2mconreastyp"
                      name="reason"
                      placeholder="Enter Reason"
                      value={newRefund.reason}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    {errors.reason && (
                      <div className="error-message">{errors.reason}</div>
                    )}
                  </td>
                </tr>
                <tr className="rnmconttd">
                  <td className="rnmconttd">
                    <div className="rnmcontit">Images</div>
                  </td>
                  <td className="rnmconttd">
                    <input
                      type="file"
                      className="rnmconinp"
                      name="imgUrl"
                      onChange={handleChangeImage}
                      multiple // Allow multiple file selection
                      required
                    />
                    <div className="image-preview-container">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img
                            src={preview}
                            alt="Preview"
                            className="preview-image"
                          />
                          <button
                            type="button"
                            className="buttonremore"
                            onClick={() => {
                              const updatedImagePreviews = imagePreviews.filter(
                                (_, i) => i !== index
                              );
                              const updatedImgUrls = newRefund.imgUrls.filter(
                                (_, i) => i !== index
                              );
                              setImagePreviews(updatedImagePreviews);
                              setNewRefund((prevRefund) => ({
                                ...prevRefund,
                                imgUrls: updatedImgUrls,
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <center>
              <button className="regbtnr" type="submit">
                Submit
              </button>
            </center>
          </form>
        </div>
      </center>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Refund;
