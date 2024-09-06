import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./paymentscss.scss";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import cod from "../../src/assets/cod.png";
import koko from "../../src/assets/koko.png";
import Webxpay from "../../src/assets/webxpay-removebg.png";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useCheckout } from "../../Frontend/order/CheckoutContext";
import { createRoot } from "react-dom/client";
import OrderConfirmationModal from "./OrderConfirmationModal";
import { PropagateLoader } from "react-spinners";
import LOGOO from "../../src/assets/logoorange.png";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ReactDOM from "react-dom";

const exchangeRatesAPI =
  "https://openexchangerates.org/api/latest.json?app_id=39818b11430a4381b1d642a587531ee4";

function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { checkoutData } = useCheckout();
  const navigate = useNavigate();
  const [validCouponApplied, setValidCouponApplied] = useState(false);
  const [errors, setErrors] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [additionalDetailsExpanded, setAdditionalDetailsExpanded] =
    useState(false);
  const [validationError, setValidationError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currency, setCurrency] = useState("LKR");
  const [orderDetails, setOrderDetails] = useState({});
  const [codAvailable, setCodAvailable] = useState(true);

  const apiUrl = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(exchangeRatesAPI);
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      }
    };
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (!checkoutData) {
      navigate("/");
      return;
    }

    const initialSubtotal = Array.isArray(checkoutData)
      ? checkoutData.reduce(
          (acc, item) => acc + parseFloat(item.price) * item.quantity,
          0
        )
      : parseFloat(checkoutData.price) * checkoutData.quantity;

    setSubtotal(initialSubtotal);
    setLoading(false);

    const fetchUserCountry = async () => {
      try {
        const response = await axios.get("https://ipapi.co/json/");
        const userCountry = response.data.country_name;
        handleCurrencyChange(userCountry);
        setFormData((prevState) => ({ ...prevState, country: userCountry }));
      } catch (error) {
        console.error("Failed to fetch user country", error);
      }
    };

    fetchUserCountry();
  }, [checkoutData, navigate]);

  const handleDownloadPDF = async () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    const root = createRoot(element);
    root.render(<Letterhead order={orderDetails} />);

    setTimeout(async () => {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("order-confirmation.pdf");

      ReactDOM.unmountComponentAtNode(element);
      document.body.removeChild(element);
    }, 500);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  useEffect(() => {
    setLoading(false);
    if (!checkoutData || checkoutData.length === 0) {
      navigate("/");
    }
  }, [checkoutData, navigate]);

  const userId = user?.UserId;
  console.log("customerid: ", userId);

  const [formData, setFormData] = useState({
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    State: "",
    address: "",
    address02: "",
    city: "",
    postalCode: "",
    additionalDetails: "",
    shippingMethod: "",
    paymentMethod: "",
    couponCode: "",
    saveAsDefault: false,
  });

  const validateAddress = async (country, State, city, postalCode) => {
    const apiKey = "AIzaSyDjX57bsRB-wSNPEg9NuF-BZFXMbXA1CPQ";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      city
    )},${encodeURIComponent(State)},${encodeURIComponent(
      country
    )}&components=postal_code:${encodeURIComponent(postalCode)}&key=${apiKey}`;

    console.log("Validating address with URL:", url);

    try {
      const response = await axios.get(url);
      console.log("Geocoding API response:", response.data);

      const { results, status, error_message } = response.data;
      if (status === "OK" && results.length > 0) {
        return true;
      } else {
        console.error(
          "Geocoding API error:",
          error_message || "No results found"
        );
        return false;
      }
    } catch (error) {
      console.error("Error validating address:", error);
      return false;
    }
  };

  const updatePrices = (newCurrency, conversionRate) => {
    const convertedSubtotal = Array.isArray(checkoutData)
      ? checkoutData.reduce(
          (acc, item) =>
            acc + parseFloat(item.price) * conversionRate * item.quantity,
          0
        )
      : parseFloat(checkoutData.price) * conversionRate * checkoutData.quantity;
    const convertedShippingPrice = selectedShippingMethod
      ? selectedShippingMethod.price * conversionRate
      : 0;
    const convertedDiscount = discount * conversionRate;
    const convertedTotal =
      convertedSubtotal + convertedShippingPrice - convertedDiscount;

    setSubtotal(convertedSubtotal);
    setTotal(convertedTotal);
    setDiscount(convertedDiscount);

    if (selectedShippingMethod) {
      setSelectedShippingMethod((prevMethod) => ({
        ...prevMethod,
        price: prevMethod.price * conversionRate,
      }));
    }
  };

  const handleCurrencyChange = (country) => {
    let newCurrency = "LKR";
    let conversionRate = 1;

    if (country === "USA" || country === "India") {
      newCurrency = "USD";
      conversionRate = exchangeRates["USD"] / exchangeRates["LKR"];
      setCodAvailable(false);
    } else {
      setCodAvailable(true);
    }

    setCurrency(newCurrency);
    updatePrices(newCurrency, conversionRate);
    fetchShippingMethods(country);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "country") {
      handleCurrencyChange(value);
    }
  };

  const fetchShippingMethods = (country) => {
    axios
      .get(`http://localhost:3001/api/shippingMethods?country=${country}`)
      .then((response) => {
        setShippingMethods(response.data);
        if (response.data.length > 0) {
          const firstMethod = response.data[0];
          setSelectedShippingMethod(firstMethod);
          setFormData((prev) => ({
            ...prev,
            shippingMethod: firstMethod.methodName,
          }));
          const initialSubtotal = Array.isArray(checkoutData)
            ? checkoutData.reduce(
                (acc, item) => acc + parseFloat(item.price) * item.quantity,
                0
              )
            : parseFloat(checkoutData.price) * checkoutData.quantity;
          setSubtotal(initialSubtotal);
          setTotal(initialSubtotal + firstMethod.price);
        } else {
          setSelectedShippingMethod(null);
          setFormData((prev) => ({ ...prev, shippingMethod: "" }));
          const initialSubtotal = Array.isArray(checkoutData)
            ? checkoutData.reduce(
                (acc, item) => acc + parseFloat(item.price) * item.quantity,
                0
              )
            : parseFloat(checkoutData.price) * checkoutData.quantity;
          setTotal(initialSubtotal);
        }
      })
      .catch((err) => console.error("Failed to fetch shipping methods", err));
  };

  const handleExpandPayment = (method) => {
    if (method === "cod") {
      toast.error("Cash on Delivery is temporarily unavailable.");
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      paymentMethod: method,
    }));
    setExpandedPayment(method === expandedPayment ? null : method);
  };

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!formData.State) newErrors.State = "State is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formData.shippingMethod)
      newErrors.shippingMethod = "Shipping method is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedClick = async () => {
    console.log("Proceed button clicked");
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    console.log("Form data:", formData);

    const isValid = await validateAddress(
      formData.country,
      formData.State,
      formData.city,
      formData.postalCode
    );

    console.log("Address validation result:", isValid);

    if (!isValid) {
      const validationErrorMessage =
        "The address provided is invalid. Please check the details.";
      setValidationError(validationErrorMessage);
      toast.error(validationErrorMessage);
      setIsLoading(false);
      return;
    }
    console.log("Proceeding with order creation...");

    try {
      const orderData = {
        ...formData,
        customerId: user?.UserId, // Include the logged-in user's ID
        items: Array.isArray(checkoutData) ? checkoutData : [checkoutData], // Ensure items is always an array
        couponCode: couponCode,
        discount: discount,
        total:
          subtotal +
          (selectedShippingMethod ? selectedShippingMethod.price : 0) -
          discount,
      };

      if (formData.paymentMethod === "koko") {
        const kokoResponse = await initiateKokoPayment(orderData);
        if (kokoResponse && kokoResponse.paymentUrl) {
          window.location.href = kokoResponse.paymentUrl;
          return;
        } else {
          throw new Error("Failed to initiate Koko payment");
        }
      }

      if (formData.paymentMethod === "webxpay") {
        try {
          const authResponse = await axios.post(
            `http://localhost:3001/api/authenticate`
          );
          const token = authResponse.data.token;

          const sessionResponse = await axios.post(
            `http://localhost:3001/api/generateSessionId`,
            {
              amount: orderData.total,
              customer: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                contactNumber: formData.contactNumber,
                addressLineOne: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (sessionResponse.data && sessionResponse.data.sessionId) {
            const sessionId = sessionResponse.data.sessionId;
            window.location.href = `https://sandbox.webxpay.com/?sid=${sessionId}`;
          } else {
            throw new Error("Session ID is undefined");
          }
        } catch (error) {
          console.error("Failed to process Webxpay payment:", error);
          toast.error("Failed to process Webxpay payment");
        }
        setIsLoading(false);
        return;
      }

      setTimeout(async () => {
        try {
          console.log("Sending order data to server:", orderData);
          const response = await axios.post(
            `http://localhost:3001/api/addOrder`,
            orderData
          );
          console.log("Order response:", response);
          toast.success("Order placed successfully");

          setOrderDetails({
            orderId: response.data.order.orderId,
            country: formData.country,
            firstName: formData.firstName,
            lastName: formData.lastName,
            contactNumber: formData.contactNumber,
            address: formData.address,
            State: formData.State,
            city: formData.city,
            postalCode: formData.postalCode,
            total: orderData.total,
          });

          setOrderPlaced(true);
          if (couponCode) {
            try {
              const deactivationResponse = await axios.post(
                `http://localhost:3001/api/deactivateCoupon`,
                { code: couponCode }
              );
              toast.info("Coupon deactivated");
            } catch (deactivationError) {
              toast.error("Failed to deactivate coupon");
            }
          }
        } catch (error) {
          console.error("Error submitting order:", error);
          toast.error(
            "Error submitting order: " +
              (error.response ? error.response.data.error : error.message)
          );
        }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to process order:", error);
      toast.error("Failed to process order: " + error.message);
      setIsLoading(false);
    }
  };

  const initiateKokoPayment = async (orderData) => {
    try {
      const dataString = generateDataString(orderData);
      const signature = generateSignature(dataString, "YOUR_RSA_PRIVATE_KEY");

      const requestBody = {
        _mId: "YOUR_MERCHANT_ID",
        api_key: "YOUR_API_KEY",
        _returnUrl: `http://localhost:3001/returnSuccess`,
        _cancelUrl: `http://localhost:3001/returnCanceled`,
        _responseUrl: `http://localhost:3001/returnResponse`,
        _amount: orderData.total.toFixed(2),
        _currency: currency,
        _reference: orderData.id,
        _orderId: orderData.id,
        _pluginName: "customapi",
        _pluginVersion: "1.0.1",
        _description: orderData.ProductName,
        _firstName: orderData.firstName,
        _lastName: orderData.lastName,
        _email: orderData.email,
        dataString: dataString,
        signature: signature,
      };

      const response = await axios.post(
        "https://prodapi.paykoko.com/api/merchants/orderCreate",
        requestBody,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to initiate Koko payment:", error);
      toast.error("Failed to initiate Koko payment");
      return null;
    }
  };

  const handleShippingChange = (method) => {
    setSelectedShippingMethod(method);
    setFormData((prev) => ({ ...prev, shippingMethod: method.methodName }));
    updatePrices(currency, formData.country);
  };

  const toggleAdditionalDetails = () => {
    setAdditionalDetailsExpanded(!additionalDetailsExpanded);
  };

  const countries = ["Sri Lanka", "USA", "India"];

  const applyCoupon = async () => {
    if (validCouponApplied) {
      toast.error("A valid coupon has already been applied.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/validateCoupon`,
        { code: couponCode, country: formData.country }
      );
      if (response.data) {
        const { discountType, discountValue } = response.data;
        let newDiscount =
          discountType === "PERCENTAGE"
            ? (subtotal * discountValue) / 100
            : discountValue;
        setDiscount(-newDiscount);
        setTotal((prevTotal) => prevTotal - newDiscount);
        setValidCouponApplied(true);
        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      toast.error("Invalid or expired coupon");
    }
  };

  const currencySymbol = currency === "USD" ? "USD" : "LKR";
  return (
    <>
      <Header />
      {loading && (
        <div className="loader-container">
          <div className="loader-overlay">
            <img src={LOGOO} alt="Logo" className="loader-logo" />
            <PropagateLoader color={"#ff3c00"} loading={true} />
          </div>
        </div>
      )}

      {!loading && (
        <div className="checkout-container">
          <div className="form-section">
            <h2>Shipping Details</h2>
            <div className="form-group country-group">
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && <p className="error">{errors.country}</p>}
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <p className="email-notice">
                This email will be used to send order confirmations and tracking
                updates.
              </p>
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group name-group">
              <div className="half-width">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                {errors.firstName && (
                  <p className="error">{errors.firstName}</p>
                )}
              </div>
              <div className="half-width">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="form-group">
              <PhoneInput
                country={"lk"}
                value={formData.contactNumber}
                onChange={(contactNumber) =>
                  setFormData((prevState) => ({ ...prevState, contactNumber }))
                }
                inputProps={{
                  name: "contactNumber",
                  required: true,
                  autoFocus: true,
                }}
                containerStyle={{
                  marginTop: "-3%",
                  marginBottom: "3%",
                  width: "100%",
                }}
                inputStyle={{
                  height: "100%",
                  width: "calc(100% - 40px)",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  marginLeft: "40px",
                }}
              />
              {errors.contactNumber && (
                <p className="error">{errors.contactNumber}</p>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="State"
                placeholder="State / Province"
                value={formData.State}
                onChange={handleInputChange}
                required
              />
              {errors.State && <p className="error">{errors.State}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="address02"
                placeholder="Address-line 02 (Apartment,suite,etc.)"
                value={formData.address2}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group name-group">
              <div className="half-width">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                {errors.city && <p className="error">{errors.city}</p>}
              </div>
              <div className="half-width">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
                {errors.postalCode && (
                  <p className="error">{errors.postalCode}</p>
                )}
              </div>
            </div>
            <div className="additional-details">
              <button
                onClick={toggleAdditionalDetails}
                className="details-button"
              >
                +
              </button>
              <span>Add Additional Details</span>
            </div>
            {additionalDetailsExpanded && (
              <div className="form-group">
                <textarea
                  name="additionalDetails"
                  placeholder="Additional Details"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            )}
            <hr />
            <h2 className="section-title">Shipping Method</h2>
            <div className="shipping-method">
              {shippingMethods.map((method) => (
                <div className="method" key={method._id}>
                  <input
                    type="radio"
                    id={method._id}
                    name="shippingMethod"
                    checked={formData.shippingMethod === method.methodName}
                    onChange={() => handleShippingChange(method)}
                    required
                  />
                  <label htmlFor={method._id}>
                    {method.methodName} - {currencySymbol}{" "}
                    {method.price.toFixed(2)}
                  </label>
                </div>
              ))}
              {errors.shippingMethod && (
                <p className="error">{errors.shippingMethod}</p>
              )}
            </div>
            <h2 className="section-title">Payment Method</h2>
            <div
              className={`payment-method ${
                expandedPayment === "koko" ? "expanded" : ""
              }`}
              onClick={() => handleExpandPayment("koko")}
            >
              <div className="method-title">
                <input
                  type="radio"
                  id="koko"
                  name="paymentMethod"
                  checked={formData.paymentMethod === "koko"}
                  onChange={() => handleExpandPayment("koko")}
                  required
                />
                <label htmlFor="koko">Koko | Buy Now Pay Later</label>
              </div>
              <div className="expand-content">
                <img src={koko} alt="Product" />
                <p>
                  Upon selecting Proceed, you will be directed to Koko: Buy Now
                  Pay Later to securely finalize your purchase.
                </p>
              </div>
            </div>
            <div
              className={`payment-method ${
                expandedPayment === "webxpay" ? "expanded" : ""
              }`}
              onClick={() => handleExpandPayment("webxpay")}
            >
              <div className="method-title">
                <input
                  type="radio"
                  id="webxpay"
                  name="paymentMethod"
                  checked={formData.paymentMethod === "webxpay"}
                  onChange={() => handleExpandPayment("webxpay")}
                  required
                />
                <label htmlFor="webxpay">WEBXPAY</label>
              </div>
              <div className="expand-content">
                <img
                  src={Webxpay}
                  alt="Product"
                  style={{ height: "150px", width: "400px" }}
                />
                <p>
                  Upon selecting Proceed, you will be redirected to WEBXPAY for
                  a secure completion of your purchase.
                </p>
              </div>
            </div>
            {codAvailable && (
              <div
                className={`payment-method ${
                  expandedPayment === "cod" ? "expanded" : ""
                }`}
                onClick={() => handleExpandPayment("cod")}
              >
                <div className="method-title">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() => handleExpandPayment("cod")}
                    disabled={total > 10000}
                    required
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                <div className="expand-content">
                  <img
                    src={cod}
                    alt="Product"
                    style={{ height: "150px", width: "400px" }}
                  />
                  <p>Pay with cash upon delivery of your order.</p>
                </div>
              </div>
            )}
            {errors.paymentMethod && (
              <p className="error">{errors.paymentMethod}</p>
            )}
            <div className="coupon-code">
              <h2 className="section-title">Coupon Code/Gift Card</h2>
              <div className="form-group">
                <label>Coupon Code:</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={handleCouponCodeChange}
                />
              </div>
              <div className="form-group">
                <button className="apply-btn" onClick={applyCoupon}>
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="order-summary" id="order-summary">
            <h2>Order Summary</h2>
            {(Array.isArray(checkoutData) ? checkoutData : [checkoutData]).map(
              (item, index) => (
                <div key={index} className="product-summary">
                  <div className="product-image-container">
                    <img
                      src={item.image}
                      alt={item.ProductName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div className="quantity-badge">{item.quantity}</div>
                  </div>
                  <div className="product-details">
                    <div className="title-and-price">
                      <h2>{item.ProductName}</h2>
                      <span className="price">
                        {" "}
                        {parseFloat(item.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="attributes">
                      <span className="size">{item.size}</span>
                      <span className="color">{item.color}</span>
                    </div>
                    <div className="subtotal">
                      <span>Subtotal</span>
                      <span>
                        {currencySymbol}{" "}
                        {(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
            <div className="order-costs">
              <p>
                <span>Shipping:</span>{" "}
                <span className="right-align">
                  {currencySymbol}{" "}
                  {selectedShippingMethod
                    ? selectedShippingMethod.price.toFixed(2)
                    : "0.00"}
                </span>
              </p>
              <p>
                <span>Discount:</span>{" "}
                <span className="right-align">
                  {currencySymbol} {discount.toFixed(2)}
                </span>
              </p>
              <p>
                <span>Total:</span>{" "}
                <span className="right-align">
                  {currencySymbol} {total.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="error"></div>
            <button
              className="proceed-btn"
              onClick={handleProceedClick}
              disabled={isLoading || orderPlaced}
            >
              {isLoading ? "Processing..." : "Proceed"}
            </button>
            {orderPlaced && (
              <OrderConfirmationModal
                isOpen={orderPlaced}
                onContinue={handleContinueShopping}
                onDownload={handleDownloadPDF}
                orderDetails={orderDetails}
              />
            )}
          </div>
        </div>
      )}
      <Footer />
      <ToastContainer />
    </>
  );
}

export default Checkout;
