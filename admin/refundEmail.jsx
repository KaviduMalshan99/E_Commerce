// import { useLocation } from 'react-router-dom';
// import queryString from 'query-string';
// import React, { useState, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import axios from 'axios';
// import './refundemail.scss'

// const RefundForm = () => {
//   const location = useLocation();
//   const { email: initialEmail } = queryString.parse(location.search); // Extract email from URL parameters
//   const [email, setEmail] = useState(initialEmail || ''); // Use extracted email as initial value
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Add Meta Pixel script to the document
//     const script = document.createElement('script');
//     script.innerHTML = `
//       !function(f,b,e,v,n,t,s)
//       {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//       n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//       if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//       n.queue=[];t=b.createElement(e);t.async=!0;
//       t.src=v;s=b.getElementsByTagName(e)[0];
//       s.parentNode.insertBefore(t,s)}(window, document,'script',
//       'https://connect.facebook.net/en_US/fbevents.js');
//       fbq('init', '1198834674449969');
//       fbq('track', 'PageView');
//     `;
//     document.head.appendChild(script);

//     const noscript = document.createElement('noscript');
//     noscript.innerHTML = `<img height="1" width="1" style="display:none"
//       src="https://www.facebook.com/tr?id=1198834674449969&ev=PageView&noscript=1"
//     />`;
//     document.body.appendChild(noscript);

//     return () => {
//       // Clean up script elements when the component is unmounted
//       document.head.removeChild(script);
//       document.body.removeChild(noscript);
//     };
//   }, []);

//   const handleSendEmail = async () => {
//     const emailData = {
//       email,
//       subject,
//       message
//     };

//     try {
//       await axios.post('http://localhost:3001/sendemail', emailData);
//       toast.success("Email sent successfully!");
//     } catch (error) {
//       console.error('Error sending email: ', error);
//       alert('There was an error sending email!');
//     }
//   };

//   return (

//     <div className="refund-form-container">
//       <div className="refund-form-inner">
//         <div className="refund-form-header">
//           <h1 className="refund-form-header-title">Send email to the Customer</h1>
//         </div>
//         <div className="refund-form-fields">
//           <div className="form-field">
//             <label className="form-field-label">Email address</label>
//             <input
//               type="email"
//               placeholder="Receiver's Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="form-field-input"
//             />
//           </div>
//           <div className="form-field">
//             <label className="form-field-label">Subject</label>
//             <input
//               type="text"
//               placeholder="Enter the subject here..."
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="form-field-input"
//             />
//           </div>
//           <div className="form-field">
//             <label className="form-field-label">Message</label>
//             <textarea
//               placeholder="Enter the refundable amount or the percentage of the product's price that can be refunded
//               to the customer..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="form-field-textarea"
//             />
//           </div>
//           <center>
//             <button
//               className="send-button"
//               onClick={handleSendEmail}
//             >
//               Send
//             </button>
//           </center>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default RefundForm;

import { useLocation } from "react-router-dom";
import queryString from "query-string";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ReactPixel from "react-facebook-pixel";
import "./refundemail.scss";
const apiUrl = import.meta.env.VITE_BACKEND_API;

const RefundForm = () => {
  const location = useLocation();
  const { email: initialEmail } = queryString.parse(location.search); // Extract email from URL parameters
  const [email, setEmail] = useState(initialEmail || ""); // Use extracted email as initial value
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    ReactPixel.init("1198834674449969"); // Replace 'YOUR_PIXEL_ID' with your actual Pixel ID
    ReactPixel.pageView(); // Track page view
  }, []);

  const handleSendEmail = async () => {
    const emailData = {
      email,
      subject,
      message,
    };

    try {
      await axios.post(`http://localhost:3001/sendemail`, emailData);
      toast.success("Email sent successfully!");

      // Track custom event when email is sent
      ReactPixel.trackCustom("EmailSent", {
        email: email,
        subject: subject,
        message: message,
      });
    } catch (error) {
      console.error("Error sending email: ", error);
      alert("There was an error sending email!");
    }
  };

  return (
    <div className="refund-form-container">
      <div className="refund-form-inner">
        <div className="refund-form-header">
          <h1 className="refund-form-header-title">
            Send email to the Customer
          </h1>
        </div>
        <div className="refund-form-fields">
          <div className="form-field">
            <label className="form-field-label">Email address</label>
            <input
              type="email"
              placeholder="Receiver's Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-field-input"
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">Subject</label>
            <input
              type="text"
              placeholder="Enter the subject here..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-field-input"
            />
          </div>
          <div className="form-field">
            <label className="form-field-label">Message</label>
            <textarea
              placeholder="Enter the refundable amount or the percentage of the product's price that can be refunded to the customer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-field-textarea"
            />
          </div>
          <center>
            <button className="send-button" onClick={handleSendEmail}>
              Send
            </button>
          </center>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RefundForm;
