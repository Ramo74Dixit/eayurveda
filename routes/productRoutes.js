const express= require('express');
const multer= require('multer');
const cloudinary = require("../config/cloudinary")
const Product = require("../models/Products")
const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({storage})
const Review =require("../models/Review")
const authenticateToken = require("../middlewares/authenticateToken")
const verifyPurchase = require('../middlewares/verifyPurchase');
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        const { name, description, price, category, quantity, stock, unit, seller } = req.body;
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl,
            quantity, // Assuming 'quantity' is now properly named, e.g., 'packSize' if representing amount per item
            stock,   // New field to manage inventory
            unit,    // New field to specify the measurement unit
            seller
        });
        await newProduct.save();
        res.status(201).json({ message: "Product added Successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get("/home-products",async(req,res)=>{
    try {
        const products = await Product.find().populate('seller','name storeName contact').sort({createdAt:-1});
        res.status(200).json({message:"Home page Products are here",products})
    } catch (error) {
        return res.status(500).json({message:"An Internal Error Occurred During Product Fetching"})
    }
})

router.post('/products/:productId/reviews', authenticateToken, verifyPurchase, async (req, res) => {
    const { rating, text } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;  // Make sure this is correctly retrieving the user's ID

    const review = new Review({
        product: productId,
        user: userId,  // This needs to correctly reference the user's ID
        rating,
        text
    });

    try {
        await review.save();
        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        res.status(400).json({ message: "Error adding review", error: error.message });
    }
});

// GET all reviews for a specific product
router.get('/:productId/reviews', async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await Review.find({ product: productId }).populate('user', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
});

// DELETE a specific review
router.delete('/reviews/:reviewId', authenticateToken, async (req, res) => {
    const { reviewId } = req.params;
    try {
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== req.user._id) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.remove();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error });
    }
});
module.exports=router;