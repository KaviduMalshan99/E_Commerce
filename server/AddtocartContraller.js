const AddToCart = require("./AddtoCartModel");

// Add an item to the cart
const addToCart = async (req, res, next) => {
    const { cartId, customerId, productId, name, price, image, size, color, quantity, availableCount } = req.body;

    try {
        // Check if the item already exists in the cart
        let cart = await AddToCart.findOne({
            cartId: cartId,
            customerId: customerId,
            productId: productId,
            size: size,
            color: color
        });

        if (cart) {
            // If the item exists, just update the quantity
            cart.quantity += quantity;
            cart.availableCount = availableCount; // update available count if needed
        } else {
            // If no such item exists, create a new cart entry
            cart = new AddToCart({
                cartId,
                customerId,
                productId,
                name,
                price,
                image,
                size,
                color,
                quantity,
                availableCount
            });
        }

        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get the cart for a specific customer
const getCart = async (req, res) => {
    const customerId = req.params.customerId; // Get customer ID from the URL parameter

    try {
        const cartItems = await AddToCart.find({ customerId: customerId });
        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: 'No cart items found for this customer.' });
        }
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to retrieve cart items: ' + error.message });
    }
};

// Update an item in the cart
const updateCartItem = async (req, res) => {
    const { cartId, itemId, quantity } = req.body;

    try {
        const cart = await AddToCart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Find the item and update quantity
        const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an item from the cart
const removeCartItem = async (req, res) => {
    const cartId = req.params.cartId;

    AddToCart.deleteOne({ cartId: cartId })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
};
