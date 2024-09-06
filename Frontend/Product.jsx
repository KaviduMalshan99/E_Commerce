import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Product.css";
//import './Product.scss';
import "./Productreviewsection.scss";
import { Link } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { useCart } from "./CartContext";
import ReviewPercentageChart from "../Frontend/ReviewPercentageChart";
import LOGOO from "../src/assets/logoorange.png";
import { PropagateLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCheckout } from "../Frontend/order/CheckoutContext";
import { useAuthStore } from "../src/store/useAuthStore";
import HomeMen from "./Home/HomeMen";
import HomeWomen from "./Home/HomeWomen";
import SizeChartModal from "./SizeChartModal";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Product = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [availableColors, setAvailableColors] = useState([]);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { setCheckoutInfo } = useCheckout();
  const [isSriLankan, setIsSriLankan] = useState(true);
  const { user } = useAuthStore();
  const [categorydata, setCategoryData] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [selectedVariationPrice, setSelectedVariationPrice] = useState(null);
  const [isSizeChartVisible, setIsSizeChartVisible] = useState(false);
  const [sizeChartImg, setSizeChartImg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = user?.UserId;

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
    const fetchProductById = async (productId) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/${productId}`
        );
        const productData = response.data.product;

        if (
          !productData ||
          typeof productData !== "object" ||
          !("ProductId" in productData)
        ) {
          throw new Error("Invalid product data received from the server");
        }

        setProduct(productData);
        setCategoryData(productData.Categories);
        console.log("Product Details:", productData);

        setTimeout(() => setLoading(false), 2000);
        console.log("Available Sizes:", productData.Sizes);
        console.log("Available Colors:", productData.Colors);

        const originalPrice = Math.min(
          ...productData.Variations.map((variation) => variation.price)
        );
        setOriginalPrice(originalPrice);
        setSelectedVariationPrice(originalPrice);
        const discountPercentage = productData.DiscountPercentage || 0;
        const discountedPrice = calculateDiscountedPrice(
          originalPrice,
          discountPercentage
        );
        setProduct((prevProduct) => ({
          ...prevProduct,
          discountedPrice: discountedPrice,
        }));

        const locationResponse = await axios.get("https://ipapi.co/json/");
        const userLocation = locationResponse.data.country_name;
        setIsSriLankan(userLocation === "Sri Lanka");
        setLoading(false);

        if (productData.sizeImg && productData.sizeImg.length > 0) {
          setIsSizeChartVisible(true);
          setSizeChartImg(productData.sizeImg[0]);
        } else {
          setIsSizeChartVisible(false);
          setSizeChartImg(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProductById(id);
    fetchReviews(id);
  }, [id]);

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/reviewsByProductId/${productId}`
      );
      const fetchedReviews = response.data.reviews;

      fetchedReviews.forEach((review, index) => {
        console.log(`Review ${index + 1}:`);
        console.log(`Customer Name: ${review.CustomerName}`);
        console.log(`Rating: ${review.Ratecount}`);
        console.log(`Review: ${review.ReviewBody}`);
        if (Array.isArray(review.ReviewImages)) {
          review.ReviewImages.forEach((image, imgIndex) => {
            console.log(`Image ${imgIndex + 1}: ${image}`);
          });
        } else {
          console.log(`Image: ${review.ReviewImages}`);
        }
        console.log(`Date: ${new Date(review.Date).toLocaleDateString()}`);
        console.log("--------------------");
      });

      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const [displayedReviews, setDisplayedReviews] = useState(3);
  const [popupImage, setPopupImage] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const convertToUSD = (priceInLKR) => {
    return priceInLKR / exchangeRate;
  };

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage) / 100;
  };

  const handleMouseEnter = (e, imageData) => {
    const rect = e.target.getBoundingClientRect();
    setPopupImage(imageData);
    setPopupPosition({
      top: rect.top + window.scrollY - rect.height,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  };

  const handleMouseLeave = () => {
    setPopupImage(null);
  };

  const handleSeeMore = () => {
    setDisplayedReviews((prevCount) => prevCount + 3);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    const selectedVariation = product.Variations.find(
      (variation) =>
        variation.size === selectedSize && variation.name === selectedColor
    );

    if (selectedVariation && quantity < selectedVariation.count) {
      setQuantity(quantity + 1);
    } else {
      toast.info("Product available count is over.");
    }
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const colors = product.Variations.filter(
      (variation) => variation.size === size
    ).map((variation) => variation.color);
    setAvailableColors(colors);
    setSelectedColor(null);
    const variation = product.Variations.find(
      (variation) => variation.size === size
    );
    setSelectedVariationPrice(variation ? variation.price : originalPrice);
  };

  const handleColorClick = (color) => {
    setSelectedColor(color);
    const selectedVariation = product.Variations.find(
      (variation) => variation.name === color && variation.size === selectedSize
    );
    if (selectedVariation) {
      setSelectedImage(selectedVariation.images);
      setSelectedVariationPrice(selectedVariation.price);
    } else {
      setSelectedImage(product.ImgUrls[0]);
      setSelectedVariationPrice(originalPrice);
    }
  };

  if (!product) {
    return <div></div>;
  }

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color.");
      return;
    }
    if (quantity < 1) {
      toast.error("Please adjust the quantity.");
      return;
    }
    const priceInUSD = convertToUSD(selectedVariationPrice);
    const dataToPass = [
      {
        productId: id,
        ProductName: product.ProductName,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: isSriLankan ? selectedVariationPrice : priceInUSD,
        currency: isSriLankan ? "LKR" : "USD",
        image: selectedImage || product.ImgUrls[0],
      },
    ];

    console.log("Passing data to checkout:", dataToPass);
    setCheckoutInfo(dataToPass);
    navigate("/checkout");
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    const selectedVariation = product.Variations.find(
      (variation) =>
        variation.name === selectedColor &&
        (!product.Variations.some((v) => v.size) ||
          variation.size === selectedSize)
    );

    if (!selectedVariation) {
      toast.error("Selected variation not available.");
      return;
    }

    if (selectedVariation.count === 0) {
      toast.error("This product is currently out of stock.");
      return;
    }

    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const cartId = `CART_${randomNumber}`;

    const itemToAdd = {
      cartId,
      productId: product.ProductId,
      name: product.ProductName,
      price: parseFloat(selectedVariation.price),
      image: selectedVariation.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      availableCount: selectedVariation.count,
      customerId: userId,
    };

    console.log("product : ", itemToAdd);

    axios
      .post(`http://localhost:3001/api/cart/add`, itemToAdd)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Product added to cart successfully");
          refreshCart();
        } else {
          toast.error("Failed to add product to cart");
        }
      })
      .catch((error) => {
        console.error("Failed to add product to cart:", error);
        toast.error("Failed to add product to cart");
      });
  };

  return (
    <div>
      <Header />
      <p className="main1">
        <Link to="/">HOME</Link> <i className="fas fa-angle-right" />{" "}
        <Link to="/men">MEN </Link>
        <i className="fas fa-angle-right" />{" "}
        <Link to="/product/:id">{product.ProductName} </Link>
      </p>

      {loading && (
        <div className="loader-container">
          <div className="loader-overlay">
            <img src={LOGOO} alt="Logo" className="loader-logo" />
            <PropagateLoader color={"#ff3c00"} loading={true} />
          </div>
        </div>
      )}

      {!loading && (
        <div className="product-container">
          <div className="left-section">
            <div className="main-image">
              <img
                src={selectedImage || product.ImgUrls[0]}
                alt={product.ProductName}
              />
            </div>
            {Array.isArray(product.ImgUrls) && (
              <div className="small-images">
                {product.ImgUrls.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={product.ProductName}
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="right-section">
            <p className="product_title">{product.ProductName}</p>
            <p className="product_price">
              {isSriLankan ? (
                <span>
                  LKR{" "}
                  {selectedVariationPrice
                    ? selectedVariationPrice.toFixed(2)
                    : originalPrice.toFixed(2)}
                </span>
              ) : (
                <span>
                  USD{" "}
                  {selectedVariationPrice
                    ? convertToUSD(selectedVariationPrice).toFixed(2)
                    : convertToUSD(originalPrice).toFixed(2)}
                </span>
              )}
            </p>

            <div className="ratings1">
              <div className="stars1">
                {Array.from({ length: product.rating }, (_, index) => (
                  <i key={index} className="fas fa-star"></i>
                ))}
                {product.rating % 1 !== 0 && (
                  <i className="fas fa-star-half"></i>
                )}
              </div>
              <span>({product.reviews} Reviews)</span>
            </div>

            <div className="description">
              <p>{product.Description}</p>
            </div>

            {product.Variations &&
              product.Variations.some((variation) => variation.size) && (
                <div className="sizebutton">
                  <p className="psize">Size</p>
                  {product.Variations.reduce((uniqueSizes, variation) => {
                    if (!uniqueSizes.includes(variation.size)) {
                      uniqueSizes.push(variation.size);
                    }
                    return uniqueSizes;
                  }, []).map((size, index) => (
                    <button
                      key={index}
                      className={selectedSize === size ? "selected" : ""}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size}
                    </button>
                  ))}

                  {selectedSize && (
                    <button
                      className="clearbutton"
                      onClick={() => setSelectedSize(null)}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

            <div>
              {isSizeChartVisible && (
                <button
                  className="size-chart-button visible"
                  style={{ top: "60%", width: "150px" }}
                  onClick={() => setShowModal(true)}
                >
                  View Size Chart
                </button>
              )}

              {showModal && (
                <SizeChartModal
                  imgSrc={sizeChartImg}
                  onClose={() => setShowModal(false)}
                />
              )}
            </div>

            {selectedSize && (
              <div className="color-section">
                <p>Colors</p>
                {product.Variations.filter(
                  (variation) => variation.size === selectedSize
                ).map((variation, index) => (
                  <button
                    key={index}
                    className={
                      selectedColor === variation.name ? "selected" : ""
                    }
                    onClick={() => handleColorClick(variation.name)}
                    value={variation.name}
                  >
                    {variation.name}
                  </button>
                ))}
              </div>
            )}
            <label>Quantity:</label>
            <div className="quantity-selector">
              <button onClick={decrementQuantity}>-</button>
              <span>{quantity}</span>
              <button onClick={incrementQuantity}>+</button>
            </div>

            <div className="abs">
              <div className="addcart">
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>
              <ToastContainer />

              <div className="buyNow">
                <button onClick={handleBuyNow}>Buy Now</button>
              </div>
            </div>

            {product.QuickDeliveryAvailable && (
              <div className="quickdelivery">
                <label>Quick Delivery Available</label>
              </div>
            )}
          </div>
        </div>
      )}

      <span className="linedevider"></span>

      <ReviewPercentageChart productId={id} />

      <div class="reviewmain-container">
        <h2 class="reviewmain-title">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p class="noss-reviews">No reviews for this product yet.</p>
        ) : (
          reviews.slice(0, displayedReviews).map((review, index) => (
            <div key={index} className="reviewss">
              <div class="reviewsmain-author">{review.CustomerName}</div>
              <div class="reviewmain-rating">
                {[...Array(review.Ratecount)].map((_, idx) => (
                  <i key={idx} className="fas fa-star"></i>
                ))}
              </div>
              <div class="reviewmain-body">
                <p>{review.ReviewBody}</p>
              </div>
              <div class="reviewmain-images">
                {review.ReviewImage.map((imageData, idx) => (
                  <img
                    key={idx}
                    src={imageData}
                    alt={`Customer ${idx + 1}`}
                    class="reviewmain-image"
                    onMouseEnter={(e) => handleMouseEnter(e, imageData)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
              <div class="reviewmain-date">
                {new Date(review.Date).toLocaleDateString()}
              </div>
            </div>
          ))
        )}

        {displayedReviews < reviews.length && (
          <div class="seessmain-more-container">
            <button onClick={handleSeeMore} class="seessmain-more-btn">
              See More
            </button>
          </div>
        )}

        {popupImage && (
          <div
            class="popupssmain"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div class="popupss-contentmain">
              <img src={popupImage} alt="Popup" class="popupssmain-image" />
            </div>
          </div>
        )}
      </div>

      <div className="alsolike">
        <h2 style={{ marginLeft: "10%", fontSize: "28px" }}>
          IT MIGHT INTEREST YOU
        </h2>
        {categorydata && (
          <>
            {categorydata.includes("Men") && <HomeMen />}
            {categorydata.includes("Women") && <HomeWomen />}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Product;
