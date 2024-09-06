const { response } = require('express');
const Product = require('./ProductModel');
const Review = require('./ReviewModel');
const axios = require('axios'); // Import axios

const getProducts = (req, res, next) => {
    Product.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({message:error})
        });
};

const addProduct = (req, res, next) => {
    const {
        ProductId,
        ProductName,
        Categories, 
        Areas,
        Variations,
        ImgUrls,
        sizeImg,
        Description,
        QuickDeliveryAvailable,
        DiscountPercentage
    } = req.body;

    
    const product = new Product({
        ProductId: ProductId,
        ProductName: ProductName,
        Categories: Categories,
        Areas:Areas,
        Variations:Variations,
        ImgUrls: ImgUrls,
        sizeImg: sizeImg,
        Description:Description,
        QuickDeliveryAvailable: QuickDeliveryAvailable,
        DiscountPercentage:DiscountPercentage
    });

    // Save the product to the database
    product.save()
        .then(response =>{
            res.json({response});
        })
        .catch(error=> {
            res.json({error});
        });
};

const updateProduct = (req, res, next) => {
    const { ProductId, ProductName, Categories, Areas, Variations, ImgUrls,sizeImg, Description, QuickDeliveryAvailable,DiscountPercentage } = req.body;

    // Corrected the parameter name to match the route parameter
    Product.findOneAndUpdate(
        { ProductId: req.params.productId }, // Corrected here
        { $set: { ProductName, Categories, Areas, Variations, ImgUrls,sizeImg, Description, QuickDeliveryAvailable,DiscountPercentage } },
        { new: true }
    )
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};




const deleteProduct = (req, res, next) => {
    const ProductId = req.params.ProductId;

    Product.deleteOne({
        ProductId: ProductId
    })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

const getProductById = (req, res, next) => {
    const productId = req.params.productId;

    Product.findOne({ ProductId: productId })
        .then(product => {
            if (!product) {
                return res.json({ message: 'Product not found' });
            }
            res.json({ product });
        })
        .catch(error => {
            res.json({ error: error.message });
        });
};
// Search products by name or ID


const searchProducts = async (req, res, next) => {
    const { query, country } = req.query;
    console.log('Search query:', query);  // Log the search query
    console.log('Country:', country);  // Log the country

    if (!query || query.trim() === '') {
        return res.json({ products: [] });
    }

    const regex = new RegExp(query, 'i');
    console.log('Regex:', regex);  // Log the regex

    let countryFilter;
    if (country === 'Sri Lanka') {
        countryFilter = { Areas: { $in: ['Sri Lanka', 'International'] } };
    } else {
        countryFilter = { Areas: { $in: ['International', 'Both'] } };
    }

    try {
        const exchangeRateResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/LKR');
        const exchangeRate = exchangeRateResponse.data.rates.USD;

        Product.find({
            $and: [
                {
                    $or: [
                        { ProductId: regex },
                        { ProductName: regex },
                        { Categories: regex }
                    ]
                },
                countryFilter
            ]
        })
        .then(products => {
            console.log('Search results:', products);  // Log the search results

            // Convert prices if the country is not Sri Lanka
            if (country !== 'Sri Lanka') {
                products = products.map(product => {
                    product.Variations.forEach(variation => {
                        variation.price = (variation.price * exchangeRate).toFixed(2);
                    });
                    return product;
                });
            }

            res.json({ products });
        })
        .catch(error => {
            console.error('Search error:', error);
            res.json({ error: error.message });
        });
    } catch (error) {
        console.error('Exchange rate error:', error);
        res.json({ error: 'Failed to fetch exchange rate' });
    }
};

const getReviewsWithProductNames = async (req, res) => {
    const userId = req.params.userId;

    try {
        const reviews = await Review.find({ customerId: userId });

        // Extract unique ProductIds from the reviews
        const productIds = reviews.map(review => review.ProductId);
        const uniqueProductIds = [...new Set(productIds)]; // Ensure unique ProductIds

        // Fetch product names for each unique ProductId
        const products = await Product.find({ ProductId: { $in: uniqueProductIds } });

        // Map the ProductId to the corresponding ProductName
        const productMap = products.reduce((acc, product) => {
            acc[product.ProductId] = product.ProductName;
            return acc;
        }, {});

        // Attach the product names to the reviews
        const reviewsWithProductNames = reviews.map(review => ({
            ...review._doc,
            ProductName: productMap[review.ProductId] || 'Unknown Product'
        }));

        res.json({ reviews: reviewsWithProductNames });
    } catch (error) {
        console.error('Error fetching reviews with product names:', error);
        res.status(500).json({ message: error.message });
    }
};




module.exports = { getProducts, addProduct, updateProduct, deleteProduct, getProductById, searchProducts,getReviewsWithProductNames };