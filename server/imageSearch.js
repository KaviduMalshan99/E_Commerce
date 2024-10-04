const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({
  dest: path.join(__dirname, '../uploads/') // Resolves to the 'uploads' folder in the current directory
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

router.post('/image-search', upload.single('image'), async (req, res) => {
  try {
    console.log(req.file);  // Log the file details

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Normalize the file path and replace backslashes with forward slashes
    let imagePath = path.join(__dirname, '../uploads/', req.file.filename);
    imagePath = imagePath.replace(/\\/g, '/');
    
    console.log('File Path:', imagePath);  // Log the file path for debugging

    // Ensure the file exists before reading it
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);

      // Dynamically import @gradio/client package
      const { Client } = await import('@gradio/client');

      // Connect to the Gradio client and send the image for prediction
      const client = await Client.connect('Ira9816/image_search_demo');  // Replace with your actual Hugging Face model ID
      const result = await client.predict('/find_similar_image', { image: imageBuffer });

      console.log(result.data);  // Log the result from Hugging Face

      // Structure the result to match the frontend expectations
      const productDetails = {
        ProductId: result.data[1],           // Product ID
        ProductName: result.data[0],         // Product name
        Variations: [
          {
            color: result.data[4],           // Product color
            size: result.data[3],            // Product sizes (comma-separated)
            price: result.data[2],           // Product price
            image: result.data[7].url,       // Image URL from Hugging Face
            inStock: result.data[5] === 'True', // Availability flag from Hugging Face
            discount: result.data[6],        // Discount percentage
          }
        ],
        Description: `Product color: ${result.data[4]}`,  // Example description
        QuickDeliveryAvailable: result.data[5] === 'True',
        Discount: result.data[6] ? `${result.data[6]} off` : null
      };

      // Send the structured result back to the frontend
      res.json({
        message: `Here is the product you requested:`,
        recommendations: [productDetails]
      });

      // Clean up the uploaded file
      fs.unlinkSync(imagePath);
    } else {
      console.error('File not found:', imagePath);
      return res.status(400).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error in image search:', error);
    res.status(500).json({ error: 'Image search failed' });
  }
});

module.exports = router;
