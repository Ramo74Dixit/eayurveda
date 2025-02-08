const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    status: { 
        type: String, 
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending'
    },
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);
