import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Faqemail.scss"; // Import the external CSS file

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Faqemail = () => {
  const [customerEmail, setCustomerEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { faqId } = useParams(); // Extract faqId from the URL params

  useEffect(() => {
    const fetchFaqDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/faq/${faqId}`
        );
        const faq = response.data.faq;
        setCustomerEmail(faq.CustomerEmail);
        setQuestion(faq.Question);
      } catch (error) {
        console.error("Error fetching FAQ details:", error);
        toast.error(
          "There was an error fetching the FAQ details. Please try again later."
        );
      }
    };

    fetchFaqDetails();
  }, [faqId]);

  const handleSendEmail = async () => {
    const emailData = {
      customerEmail,
      question,
      answer,
    };

    try {
      await axios.post(`http://localhost:3001/send=faq`, emailData);
      toast.success("Email sent successfully");

      // Clear form fields after successful email send
      setCustomerEmail("");
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(
        "There was an error sending the email. Please try again later."
      );
    }
  };

  return (
    <div>
      <div className="emailtopicpath-faq">
        FAQ Email Section (FAQ ID: {faqId})
      </div>
      <button
        onClick={() => navigate("/admin/faq")}
        className="back-button-faq"
      >
        Back to FAQs
      </button>
      <div className="container-faq">
        <div className="form-faq">
          <div className="form-header-faq">Customer FAQ Email</div>
          <div>
            <div style={{ marginBottom: "16px" }}>
              <label className="label-faq">Customer Email</label>
              <input
                type="email"
                placeholder="Customer's Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="input-faq"
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="label-faq">Question</label>
              <input
                type="text"
                placeholder="Enter the question.."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-faq"
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label className="label-faq">Answer</label>
              <textarea
                placeholder="Enter the answer.."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input-faq"
                style={{ minHeight: "100px" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                className={`button-faq ${isHovered ? "hover" : ""}`}
                onClick={handleSendEmail}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Send FAQ Email
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Faqemail;
