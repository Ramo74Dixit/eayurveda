const Order = require('../models/Orders');
const verifyPurchase = async (req, res, next) => {
    const userId = req.user.id;
    const { productId } = req.params;

    console.log("Checking orders for User ID:", userId); // Ensure this is the expected ID

    try {
        const orders = await Order.find({ user: userId }).populate('products.product');
        console.log("Orders found:", orders);

        const hasPurchased = orders.some(order =>
            order.products.some(p => {
                console.log(`Product ID in order: ${p.product._id.toString()}, Product ID from params: ${productId}`);
                return p.product._id.toString() === productId;
            })
        );

        console.log("Has purchased:", hasPurchased);

        if (!hasPurchased) {
            return res.status(403).json({ message: "You must purchase the product before reviewing it." });
        }

        next();
    } catch (error) {
        console.error("Error in verifyPurchase middleware:", error);
        res.status(500).json({ message: "Error verifying product purchase", error });
    }
};


module.exports = verifyPurchase;
