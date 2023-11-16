const express = require('express');
const { register, login, logout } = require('../controllers/UserController');
const { createUserValidation, loginUserValidation } = require('../middlewares/UserMiddleware');

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

module.exports = router;