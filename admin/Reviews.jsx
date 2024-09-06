import React, { useState, useEffect } from "react";
import "./Review.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Ratings = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(
          `http://localhost:3001/api/products`
        );
        const formattedProducts = productsResponse.data.response.map(
          (product) => ({
            ProductId: product.ProductId,
            ProductName: product.ProductName,
          })
        );

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleViewReviews = (productId) => {
    navigate(`/admin/productreviews/${productId}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.ProductId.toString().includes(searchTerm)
  );

  return (
    <div className="Review_main">
      <div className="reviewsearch-bar">
        <input
          type="text"
          placeholder="Search by Product ID"
          value={searchTerm}
          onChange={handleSearch}
          className="reviewsearch-input"
        />
      </div>

      <div className="table-container">
        <table className="Reviewtable">
          <thead>
            <tr>
              <th className="review_theader1">Product ID</th>
              <th className="review_theader2">Product Name</th>
              <th className="review_theader3">View Reviews</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.ProductId}>
                  <td>{product.ProductId}</td>
                  <td>{product.ProductName}</td>
                  <td>
                    <button
                      className="Review_viewmore"
                      onClick={() => handleViewReviews(product.ProductId)}
                    >
                      Reviews
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ratings;
