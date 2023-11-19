const Product = require('../models/Product');
const User = require('../models/User');

const getPaginatedProducts = async (req, res) => {
    let { page, brands, types } = req.query;

    page = parseInt(page); 

    const products = await Product.find();

    const allBrands = new Set();
    const allTypes = new Set();

    let filteredProducts = products;

    if (brands) {
        const brandFilters = brands.split(';');
        filteredProducts = filteredProducts.filter(product => brandFilters.includes(product.brand));
        // console.log(brandFilters)
    }
  
    if (types) {
        const typeFilters = types.split(';');
        filteredProducts = filteredProducts.filter(product => typeFilters.includes(product.type));
    }

    if (!brands && !types) {
        products.forEach((product) => {
            allBrands.add(product.brand);
            allTypes.add(product.type);
        })
        // console.log(allBrands)
    }

    // console.log(filteredProducts)

    const pageSize = 9;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const selectedProducts = filteredProducts.slice(startIndex, endIndex);
    // console.log(selectedProducts)
  
    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    res.json({
        products: selectedProducts,
        totalPages: totalPages,
        allBrands: [...allBrands],
        allTypes: [...allTypes]
    });
};

const getDetailedProduct = async (productId) => {
    try {
        const product = await Product.findById(productId);
        return product
    } catch (error) {
        console.error('Failed to retrieve product', error);
    }
}

const getSameBrandProduct = async (brand, productId) => {
    try {
        const sameBrand = await Product.find({brand});
        const sameBrandProducts = sameBrand.filter((product) => product._id.toString() !== productId);
        return sameBrandProducts;
    } catch(error) {
        console.error('Failed to retireve same brand product', error);
    }
}

const addLikedProducts = async (res, userId, productId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        user.likedProducts.push(productId);
        await user.save();
        res.status(202).json({ message: 'Product added successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Failed to add product'})
    }
}

const removeLikedProducts = async (res, userId, productId) => {
    try {
        await User.updateOne(
            {_id: userId},
            {$pull: {likedProducts: productId}}
        );
        console.log('Product removed successfully');
    } catch (error) {
        console.error('Failed to remove product', error);
        res.status(500),json({message: 'Failed to remove product'})
    }
}

module.exports = {getPaginatedProducts, getDetailedProduct, getSameBrandProduct, addLikedProducts, removeLikedProducts};