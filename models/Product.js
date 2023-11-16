const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: Buffer,
        required: true
    }
})

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;