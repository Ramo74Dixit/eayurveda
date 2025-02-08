const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String },
    quantity: { type: Number, default: 1, required: true }, // This might be better named as "packSize" or similar if it's not representing inventory
    stock: { type: Number, required: true, min: 0 }, // Represents how many units of the product are available
    active: { type: Boolean, required: true, default: true }, // To manage if the product is currently being sold
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    unit: { type: String } // Optional: add a field for unit of measure if necessary
});

module.exports = mongoose.model('Product', productSchema);
