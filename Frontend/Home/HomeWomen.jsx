import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./HomeMen.scss"; // You can create a separate stylesheet if needed
import Mint from "../../src/assets/int.png";
import Koko from "../../src/assets/koko.png";
import LOGOO from "../../src/assets/logoorange.png";
import { PropagateLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const HomeWomen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 575.98; // Check if the screen width is mobile

  const [exchangeRate, setExchangeRate] = useState(1);
  const [userLocation, setUserLocation] = useState("International");

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const exchangeRateResponse = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const exchangeRate = exchangeRateResponse.data.rates.LKR;
        setExchangeRate(exchangeRate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const locationResponse = await axios.get("https://ipapi.co/json/");
        const userLocation = locationResponse.data.country_name;
        setUserLocation(userLocation);
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(
          `http://localhost:3001/api/products`
        );
        const productsData = productsResponse.data.response;

        const filteredProducts = productsData.filter(
          (product) =>
            ((userLocation === "Sri Lanka" &&
              product.Areas.includes("Sri Lanka")) ||
              (userLocation !== "Sri Lanka" &&
                product.Areas.includes("International"))) &&
            (product.Categories.includes("Women") ||
              product.Categories.includes("Men & Women"))
        );

        const womenProducts = filteredProducts.filter(
          (product) =>
            product.Categories.includes("Women") ||
            product.Categories.includes("Men & Women")
        );

        setData(womenProducts);
        setLoading(false);
        setFilteredData(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (userLocation) {
      fetchProducts();
    }
  }, [userLocation]);

  useEffect(() => {
    let filteredProducts = data;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) =>
        product.Categories.includes(selectedCategory)
      );
    }

    if (minPrice && maxPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        const minProductPrice = Math.min(
          ...product.Variations.map((variation) => variation.price)
        );
        return (
          minProductPrice >= parseFloat(minPrice) &&
          minProductPrice <= parseFloat(maxPrice)
        );
      });
    }

    if (selectedRatings.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedRatings.includes(product.Rating.toString())
      );
    }

    if (sortOrder === "minToMax") {
      filteredProducts.sort(
        (a, b) =>
          Math.min(...a.Variations.map((variation) => variation.price)) -
          Math.min(...b.Variations.map((variation) => variation.price))
      );
    } else if (sortOrder === "maxToMin") {
      filteredProducts.sort(
        (a, b) =>
          Math.min(...b.Variations.map((variation) => variation.price)) -
          Math.min(...a.Variations.map((variation) => variation.price))
      );
    }

    setFilteredData(filteredProducts);
  }, [data, selectedCategory, minPrice, maxPrice, selectedRatings, sortOrder]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleWheelScroll = (event) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: event.deltaY,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheelScroll);
      return () => {
        container.removeEventListener("wheel", handleWheelScroll);
      };
    }
  }, []);

  const convertToUSD = (priceInLKR) => {
    return priceInLKR / exchangeRate;
  };

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage) / 100;
  };

  const isSoldOut = (variations) => {
    return variations.every((variation) => variation.count === 0);
  };

  return (
    <>
      {loading ? (
        <div className="spinner-container">
          <PropagateLoader color="#333" loading={loading} />
        </div>
      ) : (
        <div>
          <div className="menmids">
            <div className="mens" ref={scrollContainerRef}>
              {filteredData.map((record) => {
                const originalPrice = Math.min(
                  ...record.Variations.map((variation) => variation.price)
                );
                const discountPercentage = record.DiscountPercentage || 0;
                const discountedPrice = calculateDiscountedPrice(
                  originalPrice,
                  discountPercentage
                );

                return (
                  <div className="boxs" key={record.ProductId}>
                    <div
                      className="imgages"
                      onClick={() =>
                        isMobile && navigate(`/product/${record.ProductId}`)
                      }
                    >
                      <img src={record.ImgUrls[0]} alt="" />
                      {!isMobile && (
                        <div className="overlay3s">
                          <Link to={`/product/${record.ProductId}`}>
                            <p>VIEW MORE</p>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="informationss">
                      <div className="title">{record.ProductName}</div>
                      <div className="price">
                        {userLocation === "Sri Lanka" ? (
                          <>
                            {discountPercentage > 0 ? (
                              <>
                                <span className="men-discounted-price">
                                  LKR {discountedPrice.toFixed(2)}
                                </span>
                                <span className="men-original-price">
                                  LKR {originalPrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span>LKR {originalPrice.toFixed(2)}</span>
                            )}
                          </>
                        ) : (
                          <>
                            {discountPercentage > 0 ? (
                              <>
                                <span className="men-discounted-price">
                                  USD {convertToUSD(discountedPrice).toFixed(2)}
                                </span>
                                <span className="men-original-price">
                                  USD {convertToUSD(originalPrice).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span>
                                USD {convertToUSD(originalPrice).toFixed(2)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="ratingss">
                        <div className="paymentsimgs">
                          <div className="p01">
                            <p>
                              or 3 X {(discountedPrice / 3).toFixed(2)} with{" "}
                            </p>
                            <img src={Koko} className="kokopay" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeWomen;
