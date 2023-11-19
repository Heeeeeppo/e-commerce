const express = require('express');
const { reset, register, login, logout, getAllusers, resetPassword } = require('../controllers/UserController');
const { createUserValidation, loginUserValidation, resetValidation } = require('../middlewares/UserMiddleware');

const router = express.Router();

router.route('/register')
    .get((req, res) => {
        res.render('register/index')
    })
    .post(createUserValidation, register)

router.route('/login')
    .get((req, res) => {
        res.render('login/index')
    })
    .post(loginUserValidation, login)

router.get('/logout', logout)

router.get('/admin', async (req, res) => {

    if (req.headers.cookie && req.headers.cookie.includes('token')) {
        try {
            const info = [];
            info = await getAllusers();
            res.render('admin', {
                info,
                isLoggedIn: true
            })
        } catch (error) {
            res.status(500).json({message: 'Failed to fetch user info'});
        }
    } else {
        res.render('index', { 
            isLoggedIn: false,
            info: []
        });
    }
})

router.route('/forgot-password')
    .get((req, res) => {
        res.render('forgot-password');
    })
    .post(async (req, res) => {
        const {email} = req.body;
        // console.log(email)
        await resetPassword(email, res);
    })

router.route('/reset-password')
    .get((req, res) => {
        res.render('reset-password');
    })
    .patch(resetValidation, reset)

module.exports = router;