const express = require('express');
const Order = require('../models/Orders');
const Product = require('../models/Products');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

router.post('/place-order', async (req, res) => {
    const { userId, products } = req.body; // Products is an array of { product, quantity }

    try {
        const orderItems = await Promise.all(
            products.map(async ({ product, quantity }) => {
                quantity = Number(quantity);
                if (isNaN(quantity) || quantity <= 0) {
                    throw new Error('Invalid quantity provided.');
                }

                const productDetails = await Product.findById(product);
                if (!productDetails) {
                    throw new Error('Product not found.');
                }

                if (productDetails.stock < quantity) {
                    throw new Error(`Insufficient stock for product ${productDetails.name}.`);
                }

                productDetails.stock -= quantity;
                await productDetails.save();

                return { product: productDetails._id, quantity, pricePerUnit: productDetails.price };
            })
        );

        const totalPrice = orderItems.reduce((acc, item) => acc + (item.pricePerUnit * item.quantity), 0);
        
        const order = new Order({
            user: userId,
            products: orderItems,
            totalPrice
        });

        await order.save();
        await User.findByIdAndUpdate(userId, {
            $push: { orders: order._id }  
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error placing order', error: error.message });
    }
});

module.exports = router;
