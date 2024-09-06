import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./refundEdit.scss";
import { useParams, useNavigate, Link } from "react-router-dom"; // Import useParams hook to extract route parameters
import LOGOO from "../../src/assets/logoorange.png";
import { PropagateLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const RefundEdit = () => {
  const [newRefund, setNewRefund] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { orderId } = useParams(); // Extract orderId from route parameters
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview URL
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Confirmation dialog state
  const [refundToDelete, setRefundToDelete] = useState(null); // State variable to store refund to delete
  const [refunds, setRefunds] = useState([]); // State variable to store all refunds
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRefund = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/refund/${orderId}`
        );
        setNewRefund(response.data.refund); // Set fetched refund data to newRefund state
        setRefunds(response.data.refund); // Set fetched refunds data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching refund:", error);
      }
    };

    fetchRefund();
  }, [orderId]);

  // if (!newRefund) {
  //   return <p>Loading...</p>;
  // }

  const handleDelete = (orderId, event) => {
    event.preventDefault(); // Prevent default form submission
    setRefundToDelete(orderId);
    setShowConfirm(true); // Show confirmation dialog
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:3001/api/deleterefund/${refundToDelete}`)
      .then((res) => {
        setRefunds((prevRefunds) =>
          prevRefunds.filter((refund) => refund.orderId !== refundToDelete)
        );
        toast.success("Refund deleted successfully!");
        setNewRefund(null); // Reset newRefund state
        navigate(`/refund`); // Redirect to the refund page after successful update
      })
      .catch((err) => {
        console.error("Error deleting refund:", err);
        toast.error("Error deleting refund.");
      })
      .finally(() => {
        // Close the confirmation dialog
        setShowConfirm(false);
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:3001/api/updaterefund/${orderId}`, newRefund)
      .then((res) => {
        toast.success("Refund updated successfully!");
        navigate(`/refundedit/${orderId}`); // Redirect to the current page after successful update
      })
      .catch((err) => {
        console.error("Error updating refund:", err);
        toast.error("Error updating refund.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "refundDate") {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: value ? new Date(value) : null,
      }));
    } else if (name === "productIds") {
      const productIdsArray = value.split(",").map((id) => id.trim());
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: productIdsArray,
      }));
    } else {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: value,
      }));
    }
  };

  const handleChangeImage = (event) => {
    const imageFile = event.target.files[0]; // Get the first selected image

    const reader = new FileReader(); // Create a FileReader instance
    reader.onload = () => {
      // Convert the selected image to a base64 string
      const base64String = reader.result;

      // Update the newRefund state with the base64 string
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        imgUrls: [...prevRefund.imgUrls, base64String],
      }));
    };
    reader.readAsDataURL(imageFile); // Read the selected image as a data URL (base64 encoded)
  };

  const handleAddImage = () => {
    if (selectedImage) {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        imgUrls: [...prevRefund.imgUrls, URL.createObjectURL(selectedImage)],
      }));
      setSelectedImage(null); // Reset selected image after adding
      setImagePreview(null); // Clear image preview after adding
    }
  };

  const handleRemoveImage = (index) => {
    setNewRefund((prevRefund) => ({
      ...prevRefund,
      imgUrls: prevRefund.imgUrls.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {loading && (
        <div className="loader-container">
          <div className="loader-overlay">
            <img
              src={LOGOO}
              alt="Logo"
              className="loader-logo"
              style={{ height: "100px", width: "100px" }}
            />
            <PropagateLoader color={"#ff3c00"} loading={true} />
          </div>
        </div>
      )}

      {!loading && (
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
            <button
              id="transparent-buttonrr"
              onClick={() => navigate(`/refund`)}
            >
              Refund Now
            </button>
          </div>
          <center>
            <form>
              <div className="rnmcont">
                <table className="rnmcon">
                  <tbody>
                    <tr>
                      <td>
                        <div className="rnmcontit">Order ID</div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="rnmconinp"
                          name="orderId"
                          placeholder="Enter ID"
                          value={newRefund.orderId || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr className="rnmconttd">
                      <td className="rnmconttd">
                        <div className="rnmcontit">
                          Product IDs (comma separated)
                        </div>
                      </td>
                      <td className="rnmconttd">
                        <input
                          type="text"
                          className="rnmconinp"
                          name="productIds"
                          placeholder="Enter IDs"
                          value={
                            newRefund.productIds
                              ? newRefund.productIds.join(", ")
                              : ""
                          }
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="rnmcontit">Customer Name</div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="rnmconinp"
                          name="customerName"
                          placeholder="Enter Name"
                          value={newRefund.customerName || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="rnmcontit">Customer Email</div>
                      </td>
                      <td>
                        <input
                          type="email"
                          className="rnmconinp"
                          name="customerEmail"
                          placeholder="Enter Email"
                          value={newRefund.customerEmail || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="rnmcontit">Reason</div>
                      </td>
                      <td>
                        <textarea
                          className="rn2mconreastyp"
                          name="reason"
                          placeholder="Enter Reason"
                          value={newRefund.reason || ""}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </td>
                    </tr>
                    {/* <tr>
                  <td>
                    <div className="rnmcontit">Refund Initiate Date</div>
                  </td>
                  <td>
                    <input type="date" className="rnmconinp" name="refundDate" value={newRefund.refundDate ? new Date(newRefund.refundDate).toISOString().substr(0, 10) : ''} onChange={handleInputChange} required />
                  </td>
                </tr> */}
                    <tr>
                      <td>
                        <div className="rnmcontit">Add Image</div>
                      </td>
                      <td>
                        <input
                          type="file"
                          accept="image/*"
                          className="rn2mconaddimg"
                          onChange={handleChangeImage}
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="preview-image"
                          />
                        )}{" "}
                        {/* Display image preview */}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="rnmcontit">Images</div>
                      </td>
                      <td>
                        <div className="image-container">
                          {newRefund.imgUrls?.map((imageUrl, index) => (
                            <div key={index} className="image-wrapper">
                              <img
                                src={imageUrl}
                                alt={`Image ${index}`}
                                style={{ width: "100px", height: "100px" }}
                              />
                              <button
                                className="buttonremore"
                                onClick={() => handleRemoveImage(index)}
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
                <div className="rbutton-container">
                  <button className="editbtn" onClick={handleUpdate}>
                    Save Details
                  </button>
                  <button
                    className="dltbtn"
                    onClick={(event) => handleDelete(newRefund?.orderId, event)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </form>
          </center>
          <Footer />
          <ToastContainer />
          {showConfirm && (
            <div className="confirm-dialogrefun">
              <p>Are you sure you want to delete this refund?</p>
              <div>
                <button onClick={confirmDelete}>Yes</button>
                <button onClick={() => setShowConfirm(false)}>No</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RefundEdit;
