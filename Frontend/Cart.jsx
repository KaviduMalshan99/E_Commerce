import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { useAuthStore } from "../src/store/useAuthStore";
import "./Cart.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCheckout } from "../Frontend/order/CheckoutContext"; // Import the checkout context
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Cart = () => {
  const { user } = useAuthStore();
  const { setCheckoutInfo } = useCheckout(); // Use the checkout context
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [currency, setCurrency] = useState("LKR");
  const [exchangeRate, setExchangeRate] = useState(1);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    if (!user?.UserId) {
      console.error("UserId is undefined");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/cart/${user.UserId}`
      );
      const items = response.data.map((item) => ({
        ...item,
        size: item.size || "Free Size",
        quantity: item.quantity,
        name: item.name || "Unknown Product", // Ensure name exists
        productId: item.productId, // Add productId to the cart item
      }));
      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setLoading(false);
    }
  };

  const fetchCurrencyAndRate = async () => {
    try {
      const locationResponse = await axios.get("https://ipapi.co/json/");
      const countryCode = locationResponse.data.country_code;
      if (countryCode === "LK") {
        setCurrency("LKR");
        setExchangeRate(1);
      } else {
        setCurrency("USD");
        const rateResponse = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/LKR"
        );
        const rate = rateResponse.data.rates["USD"];
        setExchangeRate(rate);
      }
    } catch (error) {
      console.error("Failed to fetch currency or exchange rate:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
    fetchCurrencyAndRate();
  }, [user?.UserId]);

  const handleUpdateQuantity = async (id, delta) => {
    const newCartItems = cartItems.map((item) => {
      if (item._id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity >= 1 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(newCartItems);

    const itemToUpdate = newCartItems.find((item) => item._id === id);
    if (itemToUpdate) {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/cart/update/${id}`,
          {
            quantity: itemToUpdate.quantity,
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (response.status !== 200) {
          console.error("Failed to update item quantity in the database");
        }
      } catch (error) {
        console.error("Error updating item quantity:", error);
      }
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const total = subtotal - voucherDiscount;

  const handleDeleteItem = (itemId) => {
    const itemToDelete = cartItems.find((item) => item._id === itemId);
    if (!itemToDelete) {
      console.error("Item not found in local cart data.");
      toast.error("Item not found.");
      return;
    }

    const cartId = itemToDelete.cartId;
    axios
      .delete(`http://localhost:3001/api/deletecart/${cartId}`)
      .then((response) => {
        const updatedCartItems = cartItems.filter(
          (item) => item.cartId !== cartId
        );
        setCartItems(updatedCartItems);
        toast.success("Item deleted successfully!");
      })
      .catch((error) => {
        console.error("Failed to delete item from cart:", error);
        toast.error("Failed to delete item from cart");
      });
  };

  const handleProceedToCheckout = () => {
    const mappedCartItems = cartItems.map((item) => ({
      ...item,
      ProductName: item.name,
      price: convertCurrency(item.price),
      currency: currency,
    }));
    setCheckoutInfo(mappedCartItems);
    navigate("/checkout");
  };

  const convertCurrency = (amount) => {
    return (amount * exchangeRate).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Header />
        <div className="cart-empty">
          <p className="cartp1">Your cart is empty...!</p>
          <button className="cs" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
          <div className="cartlast">
            <p className="cartp2">Have an account?</p>
            <Link to={"/register"}>
              <p className="cartp3">Register Now</p>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="cart-container">
        <h1 className="cart-title">YOUR CART</h1>
        <div className="cart-header">
          <div className="header-product">PRODUCT</div>
          <div className="header-quantity">QUANTITY</div>
          <div className="header-total">TOTAL</div>
        </div>
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="product-details">
              <Link to={`/product/${item.productId}`}>
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="details">
                <Link
                  to={`/product/${item.productId}`}
                  className="product-name"
                >
                  {item.name}
                </Link>
                <p>
                  {item.color} | {item.size}
                </p>
                <p>
                  {currency} {convertCurrency(item.price)}
                </p>
              </div>
            </div>
            <div className="quantity-section">
              <div className="quantity-controls">
                <button onClick={() => handleUpdateQuantity(item._id, -1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleUpdateQuantity(item._id, 1)}>
                  +
                </button>
              </div>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
            <div className="total-section">
              <p>
                {currency} {convertCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
        <div className="cart-summary">
          <div className="summary-item">
            <span>Total:</span>
            <span>
              {currency} {convertCurrency(total)}
            </span>
          </div>
          <button className="checkout-btn" onClick={handleProceedToCheckout}>
            Check Out
          </button>
        </div>
        <div className="cart-notes">
          <p>
            Shipping and taxes will be calculated at checkout. You will also be
            able to redeem coupon codes on the checkout page.
          </p>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Cart;
