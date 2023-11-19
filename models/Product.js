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
        data: {
            type: Buffer,
            required: true,
          },
          contentType: {
            type: String,
            required: true,
          },
    },
    type: {
        type: String,
        required: true
    }
})

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;