import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import img1 from "../../src/assets/delivery.jpeg";
import img2 from "../../src/assets/credit.jpeg";
import img3 from "../../src/assets/refund.jpg";
import { FiPhoneCall } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { LuPlus, LuMinus } from "react-icons/lu";
import "./Contactus.scss";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const contactus = () => {
  const [CustomerName, setCustomerName] = useState("");
  const [CustomerEmail, setCustomerEmail] = useState("");
  const [Question, setQuestion] = useState("");
  const [isOpen, setIsOpen] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [questionError, setQuestionError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!CustomerName) {
      setNameError("Name is required");
      return;
    }
    if (!CustomerEmail) {
      setEmailError("Email is required");
      return;
    }
    if (!Question) {
      setQuestionError("Question is required");
      return;
    }

    try {
      const faqId = Math.floor(Math.random() * 1000000);

      const response = await axios.post("http://localhost:3001/api/addfaqs", {
        FaqID: faqId,
        CustomerName,
        CustomerEmail,
        Question,
        Date: new Date(), // Current date
      });

      console.log(response.data);
      setCustomerName("");
      setCustomerEmail("");
      setQuestion("");

      toast.success("Your question has been submitted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting question. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    setCustomerName(value);
    // Regular expression to allow only letters
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      setNameError("Name must contain only letters");
    } else {
      setNameError("");
    }
  };

  const handleToggle = (index) => {
    setIsOpen((prevIsOpen) => {
      const newIsOpen = [...prevIsOpen];
      newIsOpen[index] = !newIsOpen[index];
      return newIsOpen;
    });
  };

  return (
    <div className="main2">
      <Header />
      <div className="cotactusmain">
        <div className="container1">
          <h1 className="h1header">
            Step into Style
            <br />
            Stride with Confidence
            <br />
            Contact Well-Worn
            <br />
            Today!
          </h1>
        </div>

        <br />
        <br />
        <br />
        <div className="imgcontainercont">
          <Link to="/shipping">
            <img src={img1} alt="delivery" className="img1" />
            <div className="imgtext1">
              <h2>
                Delivery &<br />
                Tracking
              </h2>
              <button className="imgbtn1">EXPLORE</button>
            </div>
          </Link>

          <Link to="/condition">
            <img src={img2} alt="delivery" className="img2" />
            <div className="imgtext2">
              <h2>
                Order &<br />
                Payments
              </h2>
              <button className="imgbtn2">EXPLORE</button>
            </div>
          </Link>

          <Link to="/refund">
            <img src={img3} alt="delivery" className="img3" />
            <div className="imgtext3">
              <h2>
                Refunds &<br />
                Exchanges
              </h2>
              <button className="imgbtn3">EXPLORE</button>
            </div>
          </Link>
        </div>

        <span className="contactline"></span>

        <div className="accordion">
          <div className="accordion-text">
            <div className="title">Frequently asked question</div>
            <p className="pcont">
              Heres what our customers usually ask us while shopping
            </p>
          </div>

          <ul className="faq-text">
            {faqData.map((faq, index) => (
              <li key={index}>
                <div
                  className="question-arrow"
                  style={{ marginLeft: "-20%" }}
                  onClick={() => handleToggle(index)}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <span
                    className="question"
                    style={{
                      fontWeight:
                        isHovered === index || isOpen[index]
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {faq.question}
                  </span>
                  {isOpen[index] ? (
                    <LuMinus className="minus" />
                  ) : (
                    <LuPlus className="plus" />
                  )}
                </div>
                {isOpen[index] && (
                  <div>
                    <p className="contpara">{faq.answer}</p>
                    <span className="sideline"></span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <br />
        <br />
        <br />
        <br />
        <span className="contactline"></span>
        <br />

        <div className="trade">
          <div className="accordion-text">
            <div className="title">Ask Your Question</div>
          </div>

          <div className="section1">
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name : </label>
              <input
                type="text"
                id="name"
                className="faqname"
                autoComplete="name"
                placeholder="Your name"
                value={CustomerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  handleNameChange(e);
                }}
              />
              {nameError && <span className="error-message">{nameError}</span>}
              <label htmlFor="email">E-mail : </label>
              <input
                type="text"
                id="email"
                className="faqemail"
                autoComplete="email"
                value={CustomerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Your email"
              />
              {emailError && (
                <span className="error-message">{emailError}</span>
              )}
              <label htmlFor="message">Message : </label>
              <textarea
                id="message"
                className="faqtext"
                autoComplete="message"
                value={Question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Your message"
                row="6"
              ></textarea>
              {questionError && (
                <span className="error-message">{questionError}</span>
              )}

              <div className="section2">
                <button className="faqsbut" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <span className="contactline"></span>
        <br />

        <div className="sniper">
          <div className="branch1">
            <h3 className="crash">Contact us (Phone)</h3>
            <FiPhoneCall className="bx1" />
            <div>
              <p className="paradise1">
                Phone: 075 272 6993 <br />
              </p>
            </div>
          </div>
          <div className="branch1">
            <h3 className="crash">Contact us (Email)</h3>
            <TfiEmail className="bx1" />
            <div className="dddddd">
              <p className="paradise2">
                Email : wellworn@gmail.com
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

const faqData = [
  {
    question: "WHAT PAYMENT METHODS CAN I USE?",
    answer:
      "We offer a variety of payment methods, including major providers such as Mastercard, Visa, American Express, and all major international cards. Additionally, we accept various local payment methods, including Koko and MintPay.",
  },
  {
    question: "CAN I PURCHASE ITEMS WITH ANOTHER CURRENCY?",
    answer:
      "You can choose a currency that suits your personal preference. The website will direct you to the version specific to your country, based on your IP address. In this version, prices will be listed in the regional currency or in USD.",
  },
  {
    question: "CAN I MAKE CHANGES TO MY ORDER AFTER IT HAS BEEN PLACED?",
    answer:
      "Unfortunately, we are unable to make updates or modifications to an order once it has been placed. This includes removing or adding products and changing the delivery address. If there has been a mistake with your order information, it is best to quickly email us with the order number and the desired changes or call our customer service to inform them. Since orders are usually dispatched the next day, it is recommended to contact us within 24 hours with the correct information.",
  },
  {
    question: "DO YOU OFFER E-GIFT CARDS FOR INTERNATIONAL CUSTOMERS?",
    answer:
      "Our e-gift cards can be accessed or sent to individuals from other countries in USD. Our website automatically detects the user's IP address and directs them to the international version of our site, enabling them to purchase or receive e-gift cards in USD regardless of their location. This ensures a seamless and convenient experience for our global customers.",
  },
  {
    question: "HOW DO I SET UP A SUBSCRIPTION ORDER?",
    answer:
      "We strive to deliver products to you as soon as possible. Orders are typically dispatched within 1-3 days from the date of placement. If your delivery has not been received within the specified timeframe, please contact our customer service team..",
  },
  {
    question: "HOW DO I RETURN MY ITEMS?",
    answer:
      "To initiate a return or exchange due to size or product issues, please contact our customer service team. They will assist you in facilitating the process. Returns can be made through local courier agents; however, please note that we do not offer free returns to international customers. Therefore, any costs associated with returning items to us will need to be covered by you.",
  },
];

export default contactus;
