import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./EditProductModel.scss";
import { height } from "@mui/system";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const resizeAndConvertToBase64 = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const EditProductModal = ({ closeModal, product }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [productData, setProductData] = useState({
    Sizes: product.Sizes || [],
    Colors: product.Colors || [],
    Categories: product.Categories || [],
    DiscountPercentage: product.DiscountPercentage || 0,
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [selectedColorName, setSelectedColorName] = useState("");
  const [selectedColorCount, setSelectedColorCount] = useState(0);
  const [selectedColorPrice, setSelectedColorPrice] = useState("");
  const [selectedColorImages, setSelectedColorImages] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [localVariations, setLocalVariations] = useState(
    product.Variations || []
  );
  const [sizeImg, setSizeImages] = useState(product.sizeImg || []);

  useEffect(() => {
    if (product && product.ProductId) {
      setEditedProduct(product);
      setSelectedImages(product.ImgUrls || []);
      setLocalVariations(product.Variations || []);
      setProductData({
        ...productData,
        Categories: product.Categories || [],
        DiscountPercentage: product.DiscountPercentage || 0,
      });
    }
  }, [product]);

  useEffect(() => {
    if (product && product.Areas) {
      setSelectedOptions(product.Areas);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevEditedVariation) => ({
      ...prevEditedVariation,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setProductData((prevProductData) => {
      const newCategories = prevProductData.Categories.includes(category)
        ? prevProductData.Categories.filter((cat) => cat !== category)
        : [...prevProductData.Categories, category];
      return {
        ...prevProductData,
        Categories: newCategories,
      };
    });
  };

  const handleVariantChange = (e) => {
    const selectedVariant = e.target.value;
    setProductData((prevProductData) => ({
      ...prevProductData,
      VariantType: selectedVariant,
    }));
  };

  const handleRemoveVariation = (index) => {
    setLocalVariations((currentVariations) =>
      currentVariations.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...editedProduct,
        ImgUrls: selectedImages,
        Areas: selectedOptions,
        Variations: [...localVariations],
        Sizes: productData.Sizes,
        Colors: productData.Colors,
        Categories: productData.Categories,
        DiscountPercentage: productData.DiscountPercentage,
        sizeImg: sizeImg,
      };

      console.log("Submitting Updated Product:", updatedProduct);

      const response = await axios.put(
        `http://localhost:3001/api/updateproduct/${editedProduct.ProductId}`,
        updatedProduct
      );
      if (response.status === 200) {
        toast.success("Product updated successfully");
        closeModal();
      } else {
        toast.error("Failed to update the product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update the product");
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    const resizedBase64Image = await resizeAndConvertToBase64(file, 300, 300);
    setSelectedColorImages((prevImages) => [...prevImages, resizedBase64Image]);
    console.log("Resized Base64 Encoded Image:", resizedBase64Image);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    if (
      sizeInput.trim() !== "" &&
      selectedColorName &&
      selectedColorCount > 0 &&
      selectedColorPrice &&
      selectedColorImages.length > 0
    ) {
      const newVariation = {
        size: sizeInput.trim(),
        name: selectedColorName,
        count: selectedColorCount,
        price: selectedColorPrice,
        images: selectedColorImages,
      };

      setLocalVariations((prevVariations) => [...prevVariations, newVariation]);

      console.log("New Variation Data:", newVariation);

      setSizeInput("");
      setSelectedColorName("");
      setSelectedColorCount(0);
      setSelectedColorPrice("");
      setSelectedColorImages([]);
    } else {
      console.error("All fields must be filled.");
    }
  };

  const handleRemoveColor = (index) => {
    const newColors = [...productData.Colors];
    newColors.splice(index, 1);
    setProductData({
      ...productData,
      Colors: newColors,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: checked,
    });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleAddOption = () => {
    if (selectedOption) {
      setSelectedOptions([...selectedOptions, selectedOption]);
      console.log("Newly Selected Areas:", [
        ...selectedOptions,
        selectedOption,
      ]);
      setSelectedOption("");
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...selectedOptions];
    newOptions.splice(index, 1);
    setSelectedOptions(newOptions);
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleDefaultImageUpload = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        const base64String = await resizeAndConvertToBase64(file, 400, 400);
        setSelectedImages((prevImages) => [...prevImages, base64String]);
      } catch (error) {
        console.error("Error resizing and converting image:", error);
      }
    }
  };

  const handleSizeImageUpload = async (e) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const resizedImage = await resizeAndConvertToBase64(files[0], 300, 300);
        setSizeImages((prevSizeImages) => {
          // Remove the first image if there are already images
          if (prevSizeImages.length > 0) {
            return [...prevSizeImages.slice(1), resizedImage];
          } else {
            return [...prevSizeImages, resizedImage];
          }
        });
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    }
  };

  const handleRemoveSizeImage = (index) => {
    const newImages = [...sizeImg];
    newImages.splice(index, 1);
    setSizeImages(newImages);
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...productData.Sizes];
    newSizes.splice(index, 1);
    setProductData((prevData) => ({
      ...prevData,
      Sizes: newSizes,
    }));
    console.log("Updated Sizes after removal:", newSizes);
  };

  const handleDiscountPercentageChange = (e) => {
    const { value } = e.target;
    setProductData((prevProductData) => ({
      ...prevProductData,
      DiscountPercentage: parseFloat(value),
    }));
  };

  const handleCopyVariation = (variation) => {
    setSizeInput(variation.size || "");
    setSelectedColorName(variation.name || "");
    setSelectedColorCount(variation.count || 0);
    setSelectedColorPrice(variation.price || "");
  };

  return (
    <div className="editModelContainer">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="boxes">
          {/* Input fields */}
          <div className="mainbox">
            <div>
              <label>1) Product ID:</label>
              <input
                type="text"
                className="edpid"
                name="ProductId"
                value={editedProduct.ProductId}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <div className="mainbox">
            <div>
              <label>2) Product Name:</label>
              <input
                type="text"
                name="ProductName"
                value={editedProduct.ProductName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mainbox">
            <div className="editcategory">
              <label>3) Categories:(*)</label>
              <div className="category-checkboxes">
                <label>
                  <input
                    type="checkbox"
                    name="Men"
                    checked={productData.Categories.includes("Men")}
                    onChange={() => handleCategoryChange("Men")}
                    disabled={productData.Categories.includes("Women")}
                  />
                  Men
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Women"
                    checked={productData.Categories.includes("Women")}
                    onChange={() => handleCategoryChange("Women")}
                    disabled={productData.Categories.includes("Men")}
                  />
                  Women
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={productData.Categories.includes("Men & Women")}
                    onChange={() => handleCategoryChange("Men & Women")}
                  />
                  Men & Women
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Bags"
                    checked={productData.Categories.includes("Bags")}
                    onChange={() => handleCategoryChange("Bags")}
                    disabled={productData.Categories.includes("Shoes")}
                  />
                  Bags
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Shoes"
                    checked={productData.Categories.includes("Shoes")}
                    onChange={() => handleCategoryChange("Shoes")}
                    disabled={productData.Categories.includes("Bags")}
                  />
                  Shoes
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="Exclusive"
                    checked={productData.Categories.includes("Exclusive")}
                    onChange={() => handleCategoryChange("Exclusive")}
                  />
                  Exclusive
                </label>
              </div>
            </div>
          </div>

          <div className="variantslect">
            <div>
              <label>4) Select Variant Type:</label>
              <select
                value={productData.VariantType}
                onChange={handleVariantChange}
              >
                <option value="">Select Variant Type</option>
                <option value="Many Sizes with Many Colors">
                  Many Sizes with Many Colors
                </option>
              </select>
            </div>
          </div>

          {productData.VariantType && (
            <div className="manysizemanycolor">
              {productData.VariantType === "Many Sizes with Many Colors" && (
                <div className="mz1">
                  <label> Many Sizes with Many Colors:</label>
                  <div className="mzdiv">
                    <label className="q1">Add Size:</label>
                    <select
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                    >
                      <option value="">Select Size</option>
                      <option value="Freesize">Freesize</option>
                      {Array.from({ length: 21 }, (_, i) => 30 + i).map(
                        (size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        )
                      )}
                    </select>
                    <label className="q1">Color Name:</label>
                    <input
                      type="text"
                      value={selectedColorName}
                      onChange={(e) => setSelectedColorName(e.target.value)}
                      placeholder="Enter color name"
                    />
                    <label className="q1">Available Count:</label>
                    <input
                      type="number"
                      value={selectedColorCount}
                      onChange={(e) =>
                        setSelectedColorCount(parseInt(e.target.value, 10))
                      }
                      placeholder="Enter available count"
                    />
                    <label className="q1">Price:</label>
                    <input
                      type="number"
                      value={selectedColorPrice}
                      onChange={(e) =>
                        setSelectedColorPrice(parseFloat(e.target.value))
                      }
                      placeholder="Enter price"
                    />
                    <input
                      type="file"
                      onChange={handleAddImage}
                      accept="image/*"
                      multiple
                      className="imageinput"
                    />
                    <div>
                      {selectedColorImages.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image}
                            alt={`Color Image ${index}`}
                            style={{
                              height: "150px",
                              width: "150px",
                              marginLeft: "45%",
                            }}
                          />
                          <button onClick={() => handleRemoveImage(index)}>
                            Remove Image
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleAddSize}>Add Variant</button>
                  </div>

                  {/* Display added sizes */}
                  <div className="sd2">
                    {productData.Sizes.map((size, sizeIndex) => (
                      <div key={sizeIndex} className="size-item">
                        <span>Size: {size.size}</span>
                        {size.colors.map((color, colorIndex) => (
                          <div key={colorIndex} className="color-item">
                            <span>Color Name: {color.name}</span>
                            <span>Count: {color.count}</span>
                            <span>Price: {color.price}</span>
                            <div>
                              {color.images.map((image, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={image}
                                  alt={`Color Image ${sizeIndex}-${colorIndex}-${imgIndex}`}
                                  style={{ height: "150px", width: "150px" }}
                                />
                              ))}
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveColor(sizeIndex, colorIndex)
                              }
                            >
                              Remove Color
                            </button>
                          </div>
                        ))}
                        <button onClick={() => handleRemoveSize(sizeIndex)}>
                          Remove Size
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="variants">
            <h3>Variations:</h3>
            {localVariations.map((variation, index) => (
              <div className="variant" key={index}>
                <h4>Variation {index + 1}</h4>
                <p>Size: {variation.size}</p>
                <p>Name: {variation.name}</p>
                <p>Count: {variation.count}</p>
                <p>Price: {variation.price}</p>
                <p>Images:</p>
                <div>
                  {variation.images.map((image, imgIndex) => (
                    <div key={imgIndex}>
                      <img
                        src={image}
                        alt={`Variation Image ${index}-${imgIndex}`}
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          borderRadius: "5px",
                        }} // Adjust the max width and height as needed
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => handleRemoveVariation(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mainbox--quickdelivary">
            <div>
              <label>6) Quick Delivery Available:</label>
              <input
                type="checkbox"
                name="QuickDeliveryAvailable"
                checked={editedProduct.QuickDeliveryAvailable}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>7) Discount Percentage</label>
            <input
              type="number"
              className="disinput"
              name="DiscountPercentage"
              value={productData.DiscountPercentage}
              onChange={handleDiscountPercentageChange}
              min="0"
              max="100"
            />
          </div>

          <div className="mainbox-areas">
            <div>
              <label>8) Areas:</label>
              <div className="catdiv">
                <select value={selectedOption} onChange={handleOptionChange}>
                  <option value="" className="optcat">
                    Select Areas
                  </option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="International">International</option>
                </select>

                <div>
                  <button
                    className="catbtn"
                    type="button"
                    onClick={handleAddOption}
                  >
                    Add Option
                  </button>
                </div>
              </div>
            </div>

            <div className="selectedareas">
              {/* Display selected options */}
              <ul>
                {selectedOptions.map((option, index) => (
                  <li key={index}>
                    {option}
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mainbox-desc">
            <div>
              <label>10) Size Images:</label>
              <div className="imagess">
                <input
                  type="file"
                  accept="image/*"
                  className="dfile"
                  onChange={handleSizeImageUpload}
                  multiple
                />{" "}
                {/* Allow selecting multiple images */}
                <div className="imagecon">
                  {sizeImg.map((imageUrl, index) => (
                    <div key={index} className="imh">
                      <img
                        className="dimg"
                        src={imageUrl}
                        alt={`Image ${index}`}
                      />
                      <button
                        type="button"
                        className="dremove"
                        onClick={() => handleRemoveSizeImage(index)}
                      >
                        Remove Image
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mainnbox">
            <div className="desc">
              <label htmlFor="">9) Description</label>
              <textarea
                name="Description"
                value={editedProduct.Description}
                onChange={handleDescriptionChange}
                rows="10"
              ></textarea>
            </div>
          </div>

          <div className="mainbox-desc">
            <div>
              <label>10) Default Images:</label>
              <div className="imagess">
                <input
                  type="file"
                  accept="image/*"
                  className="dfile"
                  onChange={handleDefaultImageUpload}
                  multiple
                />{" "}
                {/* Allow selecting multiple images */}
                <div className="imagecon">
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className="imh">
                      <img
                        className="dimg"
                        src={imageUrl}
                        alt={`Image ${index}`}
                      />
                      <button
                        type="button"
                        className="dremove"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove Image
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="editsave">
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProductModal;
