import './Exclusive.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Exwall from '../../src/assets/Exnewim.png';
import LOGOO from '../../src/assets/logoorange.png'; // Ensure you have this logo image
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { PropagateLoader } from 'react-spinners';
import FilterExclusive from '../FilterExclusive';
import Mint from '../../src/assets/int.png';
import Koko from '../../src/assets/koko.png';
import EXCmobile from '../../src/assets/EXCMobile.png';

const apiUrl = import.meta.env.VITE_BACKEND_API;

function Exclusive() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('featured');
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [userLocation, setUserLocation] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [inStockCount, setInStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [bannerImage, setBannerImage] = useState(Exwall);

  


  useEffect(() => {
    const updateBannerImage = () => {
      if (window.innerWidth < 576) {
        setBannerImage(EXCmobile);
      } else {
        setBannerImage(Exwall);
      }
    };

    updateBannerImage();

    window.addEventListener('resize', updateBannerImage);
    return () => window.removeEventListener('resize', updateBannerImage);
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const exchangeRateResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const exchangeRate = exchangeRateResponse.data.rates.LKR;
        setExchangeRate(exchangeRate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const locationResponse = await axios.get('https://ipapi.co/json/');
        const userLocation = locationResponse.data.country_name;

        const productsResponse = await axios.get(`${apiUrl}/api/products`);
        const productsData = productsResponse.data.response;

        const filteredProducts = productsData.filter(product =>
          ((userLocation === "Sri Lanka" && product.Areas.includes("Sri Lanka")) ||
            (userLocation !== "Sri Lanka" && product.Areas.includes("International"))) &&
          (product.Categories.includes("Exclusive"))
        );

        setData(filteredProducts);
        setLoading(false);
        setFilteredData(filteredProducts);  // Fixed the assignment here
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);  // Stop loading on error
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const calculateStockCounts = () => {
      const inStock = data.filter(product => !isSoldOut(product.Variations)).length;
      const outOfStock = data.filter(product => isSoldOut(product.Variations)).length;
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
      filteredProducts = filteredProducts.filter(product => {
        const isProductSoldOut = isSoldOut(product.Variations);
        return (stockFilter === 'inStock' && !isProductSoldOut) || (stockFilter === 'outOfStock' && isProductSoldOut);
      });
    }

    if (minPrice && maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const minProductPrice = Math.min(...product.Variations.map(variation => variation.price));
        return minProductPrice >= parseFloat(minPrice) && minProductPrice <= parseFloat(maxPrice);
      });
    }

    if (selectedRatings.length > 0) {
      filteredProducts = filteredProducts.filter(product => selectedRatings.includes(product.Rating.toString()));
    }

    if (sortOrder === 'a-z') {
      filteredProducts.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
    } else if (sortOrder === 'z-a') {
      filteredProducts.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
    } else if (sortOrder === 'low-high') {
      filteredProducts.sort((a, b) => Math.min(...a.Variations.map(variation => variation.price)) - Math.min(...b.Variations.map(variation.price)));
    } else if (sortOrder === 'high-low') {
      filteredProducts.sort((a, b) => Math.min(...b.Variations.map(variation => variation.price)) - Math.min(...a.Variations.map(variation.price)));
    }

    setFilteredData(filteredProducts);
  }, [data, selectedCategory, minPrice, maxPrice, selectedRatings, sortOrder, stockFilter]);

  const handleCategoryChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(prevCategory => prevCategory === selected ? '' : selected);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleRatingChange = (event) => {
    const rating = event.target.value;
    if (event.target.checked) {
      setSelectedRatings((prevRatings) => [...prevRatings, rating]);
    } else {
      setSelectedRatings((prevRatings) => prevRatings.filter((r) => r !== rating));
    }
  };

  const handleStockFilterChange = (event) => {
    setStockFilter(event.target.value);
  };

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage / 100);
  };

  const isSoldOut = (variations) => {
    return variations.every(variation => variation.count === 0);
  };

  const convertToUSD = (priceInLKR) => {
    return priceInLKR / exchangeRate;
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const locationResponse = await axios.get('https://ipapi.co/json/');
        const userLocation = locationResponse.data.country_name;
        setUserLocation(userLocation);
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    fetchUserLocation();
  }, []);

  const clearCategory = () => {
    setSelectedCategory('');
  };

  const clearAvailability = () => {
    setStockFilter('');
  };

  const clearPrice = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const clearRating = () => {
    setSelectedRatings([]);
  };




  const handleScrollDown = () => {
    const start = window.scrollY;
    const end = document.body.scrollHeight * 0.235; // Calculate the 80% down position
    const duration = 4000; // Scroll duration in milliseconds
    const startTime = performance.now();
  
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // Progress ranges from 0 to 1
      const ease = progress * (2 - progress); // Apply easing for smooth scroll
  
      window.scrollTo(0, start + (end - start) * ease);
  
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
  
    requestAnimationFrame(animateScroll);
  };
  




  return (
    <div className="exclusive-main-container">
      {loading && (
        <div className="exclusive-loader-container">
          <div className="exclusive-loader-overlay">
            <img src={LOGOO} alt="Logo" className="exclusive-loader-logo" />
            <PropagateLoader color={'#ff3c00'} loading={true} />
          </div>
        </div>
      )}

      {!loading && (
        <>
          <Header />
        
          <div className="exclusive-main-image-container">
          
            <img className="exclusive-main-banner" src={bannerImage} alt="Banner" />
          </div>

          <div className="excentered">
              <button className="excabuton" onClick={handleScrollDown}>SHOP NOW PREMIUM</button>
            </div>

          <p className='exclusive-breadcrumb'>
            <Link to='/'>HOME</Link> <i className="fas fa-angle-right" /> <Link to="/exclusive">EXCLUSIVE </Link><i className="fas fa-angle-right" />
          </p>

          <FilterExclusive
            selectedCategory={selectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortOrder={sortOrder}
            selectedRatings={selectedRatings}
            stockFilter={stockFilter}
            inStockCount={inStockCount}
            outOfStockCount={outOfStockCount}
            handleCategoryChange={handleCategoryChange}
            handleMinPriceChange={handleMinPriceChange}
            handleMaxPriceChange={handleMaxPriceChange}
            handleSortChange={handleSortChange}
            handleRatingChange={handleRatingChange}
            handleStockFilterChange={handleStockFilterChange}
            clearCategory={clearCategory}
            clearPrice={clearPrice}
            clearRating={clearRating}
            clearAvailability={clearAvailability}
            productCounts={filteredData.length}
          />

          <div className="exclusive-product-container">
            <div className="exclusive-product-list">
              {filteredData.map(record => {
                const originalPrice = Math.min(...record.Variations.map(variation => variation.price));
                const discountPercentage = record.DiscountPercentage || 0;
                const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage);

                return (
                  <div className="exclusive-product-box" key={record.ProductId}>
                    <div className="exclusive-product-image">
                      <img src={record.ImgUrls[0]} alt="" />
                      <div className="men-product-overlay">
                        <Link to={`/product/${record.ProductId}`}><p>VIEW MORE</p></Link>
                      </div>
                      {!isSoldOut(record.Variations) && discountPercentage > 0 && (
                        <div className="exclusive-discount-percentage">
                          <span>Sale {discountPercentage}%</span>
                        </div>
                      )}
                      {isSoldOut(record.Variations) && (
                        <div className="exclusive-sold-out-notice">
                          <span>SOLD OUT</span>
                        </div>
                      )}
                    </div>
                    <div className="exclusive-product-info">
                      <div className="exclusive-product-title">{record.ProductName}</div>
                      <div className="exclusive-product-price">
                        {userLocation === "Sri Lanka" ? (
                          <>
                            {discountPercentage > 0 ? (
                              <>
                                <span className="exclusive-discounted-price">LKR {discountedPrice.toFixed(2)}</span>
                                <span className="exclusive-original-price">LKR {originalPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span>LKR {originalPrice.toFixed(2)}</span>
                            )}
                          </>
                        ) : (
                          <>
                            {discountPercentage > 0 ? (
                              <>
                                <span className="exclusive-discounted-price">USD {(convertToUSD(discountedPrice)).toFixed(2)}</span>
                                <span className="exclusive-original-price">USD {(convertToUSD(originalPrice)).toFixed(2)}</span>
                              </>
                            ) : (
                              <span>USD {(convertToUSD(originalPrice)).toFixed(2)}</span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="exclusive-product-payments">
                        <div className="exclusive-payment-option">
                          or 3 X {(discountedPrice / 3).toFixed(2)} with <img src={Koko} className='exclusive-payment-koko' />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}

export default Exclusive;
