const express= require('express');
const multer= require('multer');
const cloudinary = require("../config/cloudinary")
const Product = require("../models/Products")
const router=express.Router();
const storage=multer.memoryStorage();
const upload=multer({storage})
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
module.exports=router;