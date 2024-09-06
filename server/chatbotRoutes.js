const express = require("express");
const axios = require("axios");
const Product = require("./ProductModel");

const router = express.Router();

// Chatbot route for product recommendations
router.post("/chatbot", async (req, res) => {
    const { message } = req.body;

    try {
        console.log("Fetching products from MongoDB...");
        const products = await Product.find();

        if (!products.length) {
            return res.status(404).json({ error: "No products found" });
        }

        const productNames = products.map((product) => product.ProductName).join(", ");
        console.log("Products fetched: ", productNames);

        const aiPrompt = `The available products are: ${productNames}. 
                          The user said: ${message}. Based on this, suggest some relevant products.`;

        console.log("Sending prompt to OpenAI API...");
        const aiResponse = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003",
                prompt: aiPrompt,
                max_tokens: 150,
                n: 1,
                stop: null,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const reply = aiResponse.data.choices[0].text.trim();
        console.log("AI response received: ", reply);

        res.json({ reply });
    } catch (error) {
        console.error("Error in /chatbot route:", error.message);
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ error: "Unauthorized. Please check your OpenAI API key." });
        }
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "API endpoint not found. Please check the endpoint." });
        }
        res.status(500).json({ error: "Failed to communicate with AI or fetch products." });
    }
});

module.exports = router;
