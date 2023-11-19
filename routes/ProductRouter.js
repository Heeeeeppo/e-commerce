const express = require('express');

const {getPaginatedProducts, getDetailedProduct, getSameBrandProduct, addLikedProducts, removeLikedProducts} = require('../controllers/ProductController');
const {getLikedProducts} = require('../controllers/UserController');
const {decodeToken, decodeResetToken} = require('../utils/generateToken');

const router = express.Router();

router.get('/', getPaginatedProducts);

router.get('/details/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        // console.log(productId);
        const product = await getDetailedProduct(productId);
        const brand = product.brand;
        const sameBrandProduct = await getSameBrandProduct(brand, productId);

        let currentUser = '';

        if (req.headers.cookie) {
            const cookies = req.headers.cookie.split('; ');
            let resetToken = "";
            let token = "";
    
            for (const pair of cookies) {
                const [key, value] = pair.split("=");
                if (key === "resetToken") {
                    resetToken = value;
                } else if (key === "token") {
                    token = value;
                }
            }
            if (resetToken !== '') {
                currentUser = decodeResetToken(resetToken);
                const data = await getLikedProducts(currentUser);
                const likedProducts = data.likedProducts;

                res.render('product/index', { 
                    isLoggedIn: true,
                    product,
                    sameBrandProduct,
                    currentUser,
                    likedProducts
                });
            } else {
                currentUser = decodeToken(token);
                const data = await getLikedProducts(currentUser);
                const likedProducts = data.likedProducts;
                res.render('product/index', { 
                    isLoggedIn: true,
                    product,
                    sameBrandProduct,
                    currentUser,
                    likedProducts
                });
            }
        } else {
            res.render('product/index', { 
                isLoggedIn: false,
                product,
                sameBrandProduct,
                currentUser,
                likedProducts: []
            });
        }

    } catch (error) {
        res.status(500).send('Failed to retrieve product');
    }
    
});

router.post('/add-liked-product', async (req, res) => {
        try {
            const { userId, productId } = req.body;
            // console.log(userId, productId)
            await addLikedProducts(res, userId, productId);
        } catch (error) {
            console.error('Failed to add product', error);
            res.status(500).json({ message: 'Failed to add product' });
        }
});

router.delete('/liked-products/:productId', async (req, res) => {
    try {
        const {productId} = req.params;
        const {userId} = req.body;
        // console.log(userId)
        await removeLikedProducts(res, userId, productId);
        res.status(200).json({ message: 'Product removed successfullly'});
    } catch (error) {
        console.error('Failed to remove product', error);
        res.status(500).json({ message: 'Failed to remove product'});
    }
}) 

module.exports = router;