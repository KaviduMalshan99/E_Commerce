import React, { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState(null); // Initialize as null

  const setCheckoutInfo = (data) => {
    console.log("Setting checkout data:", data);
    setCheckoutData(data);
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutInfo }}>
      {children}
    </CheckoutContext.Provider>
  );
};
