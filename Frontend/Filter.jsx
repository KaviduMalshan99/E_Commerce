import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import FilterIMG from '../src/assets/filter.png';
import './Filter.scss';

// Custom hook to determine if the screen is mobile-sized
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 991);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 991);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const FilterSection = ({
  productCount,
  selectedCategory,
  minPrice,
  maxPrice,
  stockFilter,
  sortOrder,
  selectedRatings,
  handleCategoryChange,
  handleMinPriceChange,
  handleMaxPriceChange,
  handleSortChange,
  handleRatingChange,
  handleStockFilterChange,
  inStockCount,
  outOfStockCount,
  clearCategory,
  clearPrice,
  clearRating,
  clearAvailability,
  handleSearchChange,
  handleSearchSubmit,
  searchQuery,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [sortBy, setSortBy] = useState(sortOrder);
  const [showFilters, setShowFilters] = useState(false);

  const isMobile = useIsMobile();

  const categoryRef = useRef(null);
  const availabilityRef = useRef(null);
  const priceRef = useRef(null);
  const sortByRef = useRef(null);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const handleClickOutside = (event) => {
    if (
      (categoryRef.current && !categoryRef.current.contains(event.target)) &&
      (availabilityRef.current && !availabilityRef.current.contains(event.target)) &&
      (priceRef.current && !priceRef.current.contains(event.target)) &&
      (sortByRef.current && !sortByRef.current.contains(event.target)) &&
      !event.target.closest('.filter-left')
    ) {
      setOpenDropdown(null);
      setShowFilters(false); // Close the side menu in mobile view
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-section-container">
      <div className={`filter-left ${isMobile && showFilters ? 'show-filters' : ''}`}>
        <div className="fff" onClick={() => setShowFilters(!showFilters)}>
          <img src={FilterIMG} alt="filter img" />
          <label style={{ fontWeight: 'bold' }}>Filters: </label>
        </div>
        {(isMobile && showFilters) && (
          <>
            <div className="filter" ref={categoryRef}>
              <label>Category</label>
              <div className="dropdown">
                <div className="header">
                  <label className="category-label">Category</label>
                  <label className="reset-label" onClick={clearCategory}>
                    Clear
                  </label>
                </div>
 
                <div className="horizontal-options">
                  <div className="fd">
                    <input
                      type="checkbox"
                      name="Bags"
                      value="Bags"
                      checked={selectedCategory.includes('Bags')}
                      onChange={handleCategoryChange}
                    />
                    <label>Bags</label>
                  </div>
                  <div className="fd">
                    <input
                      type="checkbox"
                      value="Shoes"
                      checked={selectedCategory.includes('Shoes')}
                      onChange={handleCategoryChange}
                    />
                    <label>Shoes</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="filter" ref={availabilityRef}>
              <label>Availability</label>
              <div className="dropdown">
                <div className="header">
                  <label className="availability-label">Availability</label>
                  <label className="reset-label" onClick={clearAvailability}>
                    Clear
                  </label>
                </div>
                <div className="horizontal-options">
                  <div className="fd">
                    <input
                      type="checkbox"
                      value="inStock"
                      checked={stockFilter === 'inStock'}
                      onChange={handleStockFilterChange}
                    />
                    <label>In Stock ({inStockCount})</label>
                  </div>
                  <div className="fd">
                    <input
                      type="checkbox"
                      value="outOfStock"
                      checked={stockFilter === 'outOfStock'}
                      onChange={handleStockFilterChange}
                    />
                    <label>Out of Stock ({outOfStockCount})</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="filter" ref={priceRef}>
              <label>Price</label>
              <div className="dropdown">
                <div className="header">
                  <label className="price-range-label">Price Range</label>
                  <label className="reset-label" onClick={clearPrice}>
                    Clear
                  </label>
                </div>
                <div className="horizontal-options">
                  <input
                    type="text"
                    name="from"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    placeholder="From"
                  />
                  <input
                    type="text"
                    name="to"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            <div className="filter" ref={sortByRef}>
              <label>Sort By</label>
              <div className="dropdown">
                <div className="header">
                  <label className="sort-by-label">Sort By</label>
                  <label className="reset-label" onClick={() => { clearPrice(); setSortBy('featured'); }}>
                    Clear
                  </label>
                </div>
                <div className="horizontal-options">
                  <select
                    value={sortOrder}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleSortChange(e);
                    }}
                  >
                    <option value="featured">Featured</option>
                    <option value="a-z">Alphabetically, A-Z</option>
                    <option value="z-a">Alphabetically, Z-A</option>
                    <option value="high-low">Price, Low to High</option>
                    <option value="low-high">Price, High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
        {!isMobile && (
          <>
            <div className="filter" ref={categoryRef}>
              <label onClick={() => toggleDropdown('category')}>
                Category{' '}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: '13px', marginLeft: '10px' }}
                />
              </label>
              {openDropdown === 'category' && (
                <div className="dropdown">
                  <div className="header">
                    <label className="category-label">Category</label>
                    <label className="reset-label" onClick={clearCategory}>
                      Clear
                    </label>
                  </div>
                  <div className="horizontal-options">
                    <div className="fd">
                      <input
                        type="checkbox"
                        name="Bags"
                        value="Bags"
                        checked={selectedCategory.includes('Bags')}
                        onChange={handleCategoryChange}
                      />
                      <label>Bags</label>
                    </div>
                    <div className="fd">
                      <input
                        type="checkbox"
                        value="Shoes"
                        checked={selectedCategory.includes('Shoes')}
                        onChange={handleCategoryChange}
                      />
                      <label>Shoes</label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="filter" ref={availabilityRef}>
              <label onClick={() => toggleDropdown('availability')}>
                Availability{' '}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: '13px', marginLeft: '10px' }}
                />
              </label>
              {openDropdown === 'availability' && (
                <div className="dropdown">
                  <div className="header">
                    <label className="availability-label">Availability</label>
                    <label className="reset-label" onClick={clearAvailability}>
                      Clear
                    </label>
                  </div>
                  <div className="horizontal-options">
                    <div className="fd">
                      <input
                        type="checkbox"
                        value="inStock"
                        checked={stockFilter === 'inStock'}
                        onChange={handleStockFilterChange}
                      />
                      <label>In Stock ({inStockCount})</label>
                    </div>
                    <div className="fd">
                      <input
                        type="checkbox"
                        value="outOfStock"
                        checked={stockFilter === 'outOfStock'}
                        onChange={handleStockFilterChange}
                      />
                      <label>Out of Stock ({outOfStockCount})</label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="filter" ref={priceRef}>
              <label onClick={() => toggleDropdown('price')}>
                Price{' '}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: '13px', marginLeft: '10px' }}
                />
              </label>
              {openDropdown === 'price' && (
                <div className="dropdown">
                  <div className="header">
                    <label className="price-range-label">Price Range</label>
                    <label className="reset-label" onClick={clearPrice}>
                      Clear
                    </label>
                  </div>
                  <div className="horizontal-options">
                    <input
                      type="text"
                      name="from"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      placeholder="From"
                    />
                    <input
                      type="text"
                      name="to"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      placeholder="To"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="filter" ref={sortByRef}>
              <label onClick={() => toggleDropdown('sortBy')}>
                Sort By{' '}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{ fontSize: '13px', marginLeft: '10px' }}
                />
              </label>
              {openDropdown === 'sortBy' && (
                <div className="dropdown">
                  <div className="header">
                    <label className="sort-by-label">Sort By</label>
                    <label className="reset-label" onClick={() => { clearPrice(); setSortBy('featured'); }}>
                      Clear
                    </label>
                  </div>
                  <div className="horizontal-options">
                    <select
                      value={sortOrder}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        handleSortChange(e);
                      }}
                    >
                      <option value="featured">Featured</option>
                      <option value="a-z">Alphabetically, A-Z</option>
                      <option value="z-a">Alphabetically, Z-A</option>
                      <option value="low-high">Price, Low to High</option>
                      <option value="high-low">Price, High to Low</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="filter-right">
        <div className={`search-bar ${searchActive ? 'active' : ''}`}>
          <div className="search-icon" onClick={() => setSearchActive(!searchActive)}>
            <FontAwesomeIcon icon={faSearch} className="fa-search" />
          </div>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
