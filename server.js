const express = require('express');
const path = require('path');
const UserRouter = require('./routes/UserRouter');
const ProductRouter = require('./routes/ProductRouter');
const cors = require('cors')
const bodyParser = require('body-parser');

const Product = require('./models/Product');
const { getLikedProducts, getAllusers } = require('./controllers/UserController');
const { decodeToken, decodeResetToken } = require('./utils/generateToken');
const { decode } = require('punycode');

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use('/api/user', express.static('views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/user', UserRouter);
app.use('/products', ProductRouter);

app.get('/', async (req, res) => {

    if (req.headers.cookie) {
        let userId = '';
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
            userId = decodeResetToken(resetToken);
            const data = await getLikedProducts(userId);
            const adminData = await getAllusers();
            const likedProducts = data.likedProducts;

            if (data.isAdmin) {
                res.render('admin', {
                    isLoggedIn: true,
                    userInfo: adminData,
                    isAdmin: true
                })
            } else {
                res.render('index', { 
                    isLoggedIn: true,
                    likedProducts,
                    currentUser: userId,
                });
            }
        } else {
            userId = decodeToken(token);
            const data = await getLikedProducts(userId);
            const adminData = await getAllusers();
            const likedProducts = data.likedProducts;

            if (data.isAdmin) {
                res.render('admin', {
                    isLoggedIn: true,
                    userInfo: adminData,
                    isAdmin: true
                })
            } else {
                res.render('index', { 
                    isLoggedIn: true,
                    likedProducts,
                    currentUser: userId,
                });
            }
        }
    } else {
        res.render('index', { 
            isLoggedIn: false,
            likedProducts: [],
            currentUser: '',
        });
    }
    
})

app.all('*', (_req, res) => {
    res.redirect('/');
});


module.exports = app;