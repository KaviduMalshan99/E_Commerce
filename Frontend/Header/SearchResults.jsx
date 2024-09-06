import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard"; // Assuming you have a ProductCard component
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const SearchResults = () => {
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products`);
        const products = response.data.response;

        // Filter products based on search query
        const filtered = products.filter((product) =>
          product.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredProducts(filtered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="search-results">
        <h2>Search Results for "{searchQuery}"</h2>
        <div className="product-list">
          {filteredProducts.map((product) => (
            <ProductCard key={product.ProductId} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
