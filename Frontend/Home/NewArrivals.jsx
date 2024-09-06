import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NewArrivals.scss";
import Mint from "../../src/assets/int.png";
import Koko from "../../src/assets/koko.png";
import { PropagateLoader } from "react-spinners";
import LOGOO from "../../src/assets/logoorange.png";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const NewArrivals = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]); // State to hold the products to be displayed initially
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [userLocation, setUserLocation] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

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
    const fetchProducts = async () => {
      try {
        const locationResponse = await axios.get("https://ipapi.co/json/");
        const userLocation = locationResponse.data.country_name;
        setUserLocation(userLocation);

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
            product.Categories.includes("New Arrival")
        );
        setData(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateStockCounts = () => {
      const inStock = data.filter(
        (product) => !isSoldOut(product.Variations)
      ).length;
      const outOfStock = data.filter((product) =>
        isSoldOut(product.Variations)
      ).length;
      setInStockCount(inStock);
      setOutOfStockCount(outOfStock);
    };
    calculateStockCounts();
  }, [data]);

  useEffect(() => {
    let filteredProducts = data;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) =>
        product.Categories.includes(selectedCategory)
      );
    }

    if (stockFilter) {
      filteredProducts = filteredProducts.filter((product) => {
        const isProductSoldOut = isSoldOut(product.Variations);
        return (
          (stockFilter === "inStock" && !isProductSoldOut) ||
          (stockFilter === "outOfStock" && isProductSoldOut)
        );
      });
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

    if (sortOrder === "a-z") {
      filteredProducts.sort((a, b) =>
        a.ProductName.localeCompare(b.ProductName)
      );
    } else if (sortOrder === "z-a") {
      filteredProducts.sort((a, b) =>
        b.ProductName.localeCompare(a.ProductName)
      );
    } else if (sortOrder === "low-high") {
      filteredProducts.sort(
        (a, b) =>
          Math.min(...a.Variations.map((variation) => variation.price)) -
          Math.min(...b.Variations.map(variation.price))
      );
    } else if (sortOrder === "high-low") {
      filteredProducts.sort(
        (a, b) =>
          Math.min(...b.Variations.map(variation.price)) -
          Math.min(...a.Variations.map(variation.price))
      );
    }

    setFilteredData(filteredProducts);

    // Select 8 random products for initial display
    const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());
    setDisplayedData(shuffledProducts.slice(0, 8));
  }, [
    data,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedRatings,
    sortOrder,
    stockFilter,
  ]);

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage) / 100;
  };

  const isSoldOut = (variations) => {
    return variations.every((variation) => variation.count === 0);
  };

  const convertToUSD = (priceInLKR) => {
    return priceInLKR / exchangeRate;
  };

  return (
    <div className="container">
      {loading ? (
        <div className="spinner-containerrr">
          <PropagateLoader color="#333" loading={loading} />
        </div>
      ) : (
        <div className="menNAmid">
          <div className="menNA">
            {displayedData.map((record) => {
              const originalPrice = Math.min(
                ...record.Variations.map((variation) => variation.price)
              );
              const discountPercentage = record.DiscountPercentage || 0;
              const discountedPrice = calculateDiscountedPrice(
                originalPrice,
                discountPercentage
              );

              return (
                <div className="NAbox" key={record.ProductId}>
                  <div className="NAimgage">
                    <Link to={`/product/${record.ProductId}`}>
                      <img src={record.ImgUrls[0]} alt="" />
                    </Link>
                    {/* <div className="NAoverlay3">
                      <Link to={`/product/${record.ProductId}`}><p>VIEW MORE</p></Link>
                    </div> */}
                    {!isSoldOut(record.Variations) &&
                      discountPercentage > 0 && (
                        <div className="NAdiscount-percentage">
                          <span>Sale {discountPercentage}%</span>
                        </div>
                      )}
                  </div>
                  {isSoldOut(record.Variations) && (
                    <div className="NAsold-out-notice">
                      <span>SOLD OUT</span>
                    </div>
                  )}
                  <div className="NAinformations">
                    <div className="NAtitle">{record.ProductName}</div>
                    <div className="NAprice">
                      {userLocation === "Sri Lanka" ? (
                        <>
                          {discountPercentage > 0 ? (
                            <>
                              <span className="NAoriginal-priceee">
                                LKR {originalPrice.toFixed(2)}
                              </span>
                              <br />
                              <span className="NAdiscounted-priceee">
                                LKR {discountedPrice.toFixed(2)}
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
                              <span className="NAoriginal-priceee">
                                USD {convertToUSD(originalPrice).toFixed(2)}
                              </span>
                              <br />
                              <span className="NAdiscounted-priceee">
                                USD {convertToUSD(discountedPrice).toFixed(2)}
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
                    <div className="NAratings">
                      <div className="NApaymentsimg">
                        <div className="p02">
                          or 3 X {(discountedPrice / 3).toFixed(2)} with{" "}
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
      )}
    </div>
  );
};

export default NewArrivals;
