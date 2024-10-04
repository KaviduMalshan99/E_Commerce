// ChatbotController.js
const OpenAI = require("openai");
const Product = require('./ProductModel');
const axios = require('axios');

// Initialize the OpenAI instance with the API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Live support sessions, could be connected to a real DB
let liveSupportSessions = {};

// Function to check if the query should be transferred to live support
const liveSupportQueries = ["speak to a representative", "customer service", "speak to an agent"];
const shouldTransferToLiveSupport = (userQuery) => {
    return liveSupportQueries.some(query => userQuery.includes(query.toLowerCase()));
};

// Define general query responses
const generalQueries = {
    greeting: {
        message: "Hello! How can I assist you today?"
    },
    refund: {
        message: "You can apply for a refund using the link below:",
        link: { text: "Refund Form", url: "http://localhost:5173/refund" },
        linkPolicy: { text: "Refund Policy", url: "http://localhost:5173/refundPolicy" }
    },
    aboutus: {
        message: "Learn more about us using the link below:",
        link: { text: "About Us", url: "http://localhost:5173/aboutus" }
    },
    contact: {
        message: "You can contact us through the details below:",
        contact: {
            phone: "Phone: 075 272 6993",
            email: "Email: contact@gmail.com"
        }
    },
    privacy: {
        message: "View our privacy policy here:",
        link: { text: "Privacy Policy", url: "http://localhost:5173/privacy" }
    },
    terms: {
        message: "View our terms and conditions here:",
        link: { text: "Terms and Conditions", url: "http://localhost:5173/condition" }
    },
    unresolved: {
        message: "It seems I can't help with that. Would you like to connect with a live support agent?",
        liveSupport: true
    }
};

// Function to check if the query matches a greeting
const isGreeting = (userQuery) => {
    const greetings = ["hi", "hello", "hey", "how are you", "good morning", "good afternoon", "good evening"];
    return greetings.includes(userQuery.toLowerCase());
};

// Function to check if the query matches a general query (like refund, about, etc.)
const matchGeneralQuery = (userQuery) => {
    const lowerQuery = userQuery ? userQuery.toLowerCase() : ''; // Ensure query is a string
    if (isGreeting(lowerQuery)) return "greeting";
    if (lowerQuery.includes("refund")) return "refund";
    if (lowerQuery.includes("about")) return "aboutus";
    if (lowerQuery.includes("contact")) return "contact";
    if (lowerQuery.includes("privacy")) return "privacy";
    if (lowerQuery.includes("terms")) return "terms";
    return null;
};

// Helper function to parse user query for product attributes
const parseQueryForAttributes = (userQuery) => {
    const colorRegex = /(black|white|red|blue|green|yellow|brown|pink|purple|orange|grey)/i;
    const sizeRegex = /(\b(?:free size|xs|s|m|l|xl|xxl|3xl|\d{1,2})\b)/i;
    const categoryRegex = /(men|women)\s+(shoes|bags)/i;
    const availabilityRegex = /\b(available)\b/i;

    const colorMatch = userQuery ? userQuery.match(colorRegex) : null;
    const sizeMatch = userQuery ? userQuery.match(sizeRegex) : null;
    const categoryMatch = userQuery ? userQuery.match(categoryRegex) : null;
    const availabilityMatch = userQuery ? userQuery.match(availabilityRegex) : null;

    return {
        color: colorMatch ? colorMatch[0].toLowerCase() : null,
        size: sizeMatch ? sizeMatch[0].toLowerCase() : null,
        category: categoryMatch ? { gender: categoryMatch[1].toLowerCase(), type: categoryMatch[2].toLowerCase() } : null,
        available: availabilityMatch ? true : false
    };
};

// Function to check if the session is resolved
const isSessionResolved = (sessionId) => {
    return liveSupportSessions[sessionId] && !liveSupportSessions[sessionId].active;
};

// Chatbot function
const chatbot = async (req, res) => {
    try {
        const userQuery = req.body.query ? req.body.query.toLowerCase() : ''; // Ensure query is a string
        const sessionId = req.body.sessionId;
        const socketId = req.body.socketId; // Ensure socketId is passed correctly
        const userId = req.body.userId; // Ensure userId is passed

        // Check if live support has been resolved
        if (isSessionResolved(sessionId)) {
            delete liveSupportSessions[sessionId]; // Reset the live support session
        }
        // Check if the query should be transferred to live support
        if (shouldTransferToLiveSupport(userQuery)) {
            // Check if the session is already active for live support
            if (!liveSupportSessions[sessionId]?.active) {
                liveSupportSessions[sessionId] = { active: true, userSocketId: socketId };

                // Send the transfer request to live support
                await axios.post('http://localhost:3001/api/live-support/transfer', {
                    userQuery,
                    userId: sessionId,
                    sessionId
                });

                // Emit user query to live support dashboard
                req.app.get('socketio').emit('forwardUserMessageToAgent', { sessionId, message: userQuery });

                // Inform the frontend that live support is being activated
                return res.json({
                    message: "Your query has been transferred to a live support agent.",
                    requireLiveSupport: true
                });
            }

            // If already transferred to live support, don't echo back the user query
            return res.json({ message: "Message forwarded to the live agent." });
        } else if (liveSupportSessions[sessionId]?.active) {
            // If live support is already active, forward the user's query to the live agent
            await axios.post('http://localhost:3001/api/live-support/transfer', {
                userQuery,
                userId: sessionId,
                sessionId
            });

            req.app.get('socketio').emit('forwardUserMessageToAgent', { sessionId, message: userQuery });

            return res.json({
                message: "Your message has been sent to the live support agent."
            });
        }

        // Handle non-live support queries (chatbot logic)
        const generalQueryType = matchGeneralQuery(userQuery);

        if (generalQueryType) {
            const generalResponse = generalQueries[generalQueryType];

            // Structure the response for general queries
            if (generalResponse.link) {
                return res.json({
                    message: generalResponse.message,
                    link: generalResponse.link,
                    ...(generalResponse.linkPolicy ? { linkPolicy: generalResponse.linkPolicy } : {})
                });
            } else if (generalResponse.contact) {
                return res.json({
                    message: generalResponse.message,
                    contact: generalResponse.contact
                });
            } else {
                return res.json({
                    message: generalResponse.message,
                    liveSupport: generalResponse.liveSupport || false
                });
            }
        }

        // Fetch products from the database
        const products = await Product.find({});
        if (products.length === 0) {
            return res.json({
                message: "No products available at the moment."
            });
        }

        // Parse the user query for product attributes
        const { color, size, category, available } = parseQueryForAttributes(userQuery);

        // Filter products based on parsed attributes
        let filteredProducts = products;

        if (category) {
            filteredProducts = filteredProducts.filter(product =>
                product.Categories.includes(category.gender.charAt(0).toUpperCase() + category.gender.slice(1)) &&
                product.Categories.includes(category.type.charAt(0).toUpperCase() + category.type.slice(1))
            );
        }

        if (color || size || available) {
            filteredProducts = filteredProducts.map(product => ({
                ...product.toObject(),
                Variations: product.Variations.filter(variation => {
                    const matchesColor = color ? variation.name.toLowerCase() === color : true;
                    const matchesSize = size ? variation.size.toLowerCase() === size : true;
                    const matchesAvailability = available ? variation.count > 0 : true;
                    return matchesColor && matchesSize && matchesAvailability;
                })
            })).filter(product => product.Variations.length > 0);
        }

        // Exact product match by ProductName or ProductId
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

        // Structure the product details for the response
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

        // Return the filtered products or a message if no products match the query
        if (productsWithDetails.length > 0) {
            return res.json({
                message: `Here are the products matching your query:`,
                recommendations: productsWithDetails
            });
        } else {
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

const activateLiveSupport = (req, res) => {
    const sessionId = req.body.sessionId;
    liveSupportSessions[sessionId].active = true;
    return res.json({
        message: "Live support activated. An agent will join shortly.",
        isLiveSupport: true
    });
};

// Resolve live support session
const resolveLiveSupport = (req, res) => {
    const { sessionId } = req.body;
    liveSupportSessions[sessionId].active = false;

    return res.json({ message: "Live support session has been resolved. You can now continue interacting with the chatbot." });
};


module.exports = { chatbot, activateLiveSupport, resolveLiveSupport };
