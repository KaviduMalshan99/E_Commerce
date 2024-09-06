import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../src/store/useAuthStore";

const apiUrl = import.meta.env.VITE_BACKEND_API;
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
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
        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
        setLoading(false);
      }
      setLoading(false);
    };

    fetchCartItems();
  }, [refresh]);

  const refreshCart = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
