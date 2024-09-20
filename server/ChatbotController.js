const OpenAI = require("openai");
const Product = require('./ProductModel');

// Initialize the OpenAI instance with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to parse user query for product attributes
const parseQueryForAttributes = (userQuery) => {
    const colorRegex = /(black|white|red|blue|green|yellow|brown|pink|purple|orange|grey)/i;
    const sizeRegex = /(\b(?:free size|xs|s|m|l|xl|xxl|3xl|\d{1,2})\b)/i;
    const categoryRegex = /(men|women)\s+(shoes|bags)/i;
    const availabilityRegex = /\b(available)\b/i;

    const colorMatch = userQuery.match(colorRegex);
    const sizeMatch = userQuery.match(sizeRegex);
    const categoryMatch = userQuery.match(categoryRegex);
    const availabilityMatch = userQuery.match(availabilityRegex);

    return {
        color: colorMatch ? colorMatch[0].toLowerCase() : null,
        size: sizeMatch ? sizeMatch[0].toLowerCase() : null,
        category: categoryMatch ? { gender: categoryMatch[1].toLowerCase(), type: categoryMatch[2].toLowerCase() } : null,
        available: availabilityMatch ? true : false
    };
};

// Chatbot function
const chatbot = async (req, res) => {
    try {
        const userQuery = req.body.query.toLowerCase();

        // Step 1: Fetch all products from the database
        const products = await Product.find({});
        if (products.length === 0) {
            return res.json({
                message: "No products available at the moment."
            });
        }

        // Step 2: Parse the user query for attributes
        const { color, size, category, available } = parseQueryForAttributes(userQuery);

        // Step 3: Filter products based on parsed attributes
        let filteredProducts = products;

        if (category) {
            filteredProducts = filteredProducts.filter(product =>
                product.Categories.includes(category.gender.charAt(0).toUpperCase() + category.gender.slice(1)) &&
                product.Categories.includes(category.type.charAt(0).toUpperCase() + category.type.slice(1))
            );
        }

        if (color || size || available) {
            filteredProducts = filteredProducts.map(product => {
                return {
                    ...product.toObject(),
                    Variations: product.Variations.filter(variation => {
                        const matchesColor = color ? variation.name.toLowerCase() === color : true;
                        const matchesSize = size ? variation.size.toLowerCase() === size : true;
                        const matchesAvailability = available ? variation.count > 0 : true;
                        return matchesColor && matchesSize && matchesAvailability;
                    })
                };
            }).filter(product => product.Variations.length > 0);
        }

        // Step 4: Exact product match by ProductName or ProductId
        let exactMatchProduct = null;
        products.forEach(product => {
            if (userQuery.includes(product.ProductName.toLowerCase()) || userQuery.includes(product.ProductId.toLowerCase())) {
                exactMatchProduct = product;
            }
        });

        if (exactMatchProduct) {
            const productDetails = {
                ProductId: exactMatchProduct.ProductId,
                ProductName: exactMatchProduct.ProductName,
                Variations: exactMatchProduct.Variations.map(variation => ({
                    color: variation.name,
                    size: variation.size,
                    price: variation.price,
                    inStock: variation.count > 0,
                    image: variation.images[0]
                })),
                Description: exactMatchProduct.Description,
                QuickDeliveryAvailable: exactMatchProduct.QuickDeliveryAvailable,
                Discount: exactMatchProduct.DiscountPercentage > 0 ? `${exactMatchProduct.DiscountPercentage}%` : null
            };

            return res.json({
                message: `Here is the product you requested:`,
                recommendations: [productDetails]
            });
        }

        // Step 5: Structure the product details for the response
        const productsWithDetails = filteredProducts.map(product => ({
            ProductId: product.ProductId,
            ProductName: product.ProductName,
            Variations: product.Variations.map(variation => ({
                color: variation.name,
                size: variation.size,
                price: variation.price,
                inStock: variation.count > 0,
                image: variation.images[0] // Assuming the first image is the main one
            })),
            Description: product.Description,
            QuickDeliveryAvailable: product.QuickDeliveryAvailable,
            Discount: product.DiscountPercentage > 0 ? `${product.DiscountPercentage}%` : null
        }));

        // Step 6: Return the filtered products or a message if no products match the query
        if (productsWithDetails.length > 0) {
            return res.json({
                message: `Here are the products matching your query:`,
                recommendations: productsWithDetails
            });
        } else {
            // Step 7: Handle non-existent products and suggest alternatives
            const suggestions = products.slice(0, 3); // Show first 3 products as suggestions
            return res.json({
                message: "No products found matching your query. Here are some similar products:",
                recommendations: suggestions.map(product => ({
                    ProductId: product.ProductId,
                    ProductName: product.ProductName,
                    Variations: product.Variations.map(variation => ({
                        color: variation.name,
                        size: variation.size,
                        price: variation.price,
                        inStock: variation.count > 0,
                        image: variation.images[0] // Assuming the first image is the main one
                    })),
                    Description: product.Description,
                    QuickDeliveryAvailable: product.QuickDeliveryAvailable,
                    Discount: product.DiscountPercentage > 0 ? `${product.DiscountPercentage}%` : null
                }))
            });
        }

    } catch (error) {
        console.error('Error in chatbot:', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Something went wrong with the chatbot' });
        }
    }
};

module.exports = { chatbot };
