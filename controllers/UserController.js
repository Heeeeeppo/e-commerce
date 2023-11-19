const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const {generateToken, generateResetToken} = require('../utils/generateToken');

require("dotenv").config({path: path.join(__dirname, '../.env')});

const EMAIL_ADD = process.env.EMAIL_ADD;
const EMAIL_PWD =  process.env.EMAIL_PWD;

const reset = async (req, res) => {
    const { usernameOrEmail, password, confirmPwd } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (password !== confirmPwd) {
            return res.status(401).json({ message: 'Passwords are not same'});
        }       

        const hashedPassword = await bcrypt.hash(password, 10);
        
        if (user.password === hashedPassword) {
            return res.status(401).json({ message: 'Cannot use the same password as before'});
        } else {
            user.password = hashedPassword;
            await user.save();

            return res.status(201).json({ message: 'Password reset successfully' });
        } 
    } catch(error) {
        console.error('Failed to reset password:', error);
        return res.status(500),json({ message: error.message });
    }
    
};

const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
    const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

    return res.status(200).json({ token });
    } catch (error) {
    console.error('Failed to login:', error);
    return res.status(500).json({ message: error.message });
    }
};

const register = async (req, res) => {
    const { username, email, password , confirmPwd} = req.body;
 
    try {
        const existingUsername = await User.findOne({username}); 
        const existingEmail = await User.findOne({email});
        if (existingUsername || existingEmail) {
            return res.status(409).json({ message: 'User already exists'});
        }

        if (password !== confirmPwd) {
            return res.status(401).json({ message: 'Passwords are not same'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save()

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        return res.status(201).json({ token });
    } catch(error) {
        console.error('Failed to register:', error);
        return res.status(500),json({ message: error.message });
    }
    
};

const logout = (_req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('resetToken');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

const getLikedProducts = async (userId) => {
    try {
        const user = await User.findById(userId).populate('likedProducts');
        if (!user) {
            console.error('User not found');
            return null;
        }
        return {
            likedProducts: user.likedProducts,
            isAdmin: user.isAdmin
        }
    } catch (error) {
        console.error("Failed to get user's liked products", error);
    }
}

const getAllusers = async () => {
    try {
        const users = await User.find({ isAdmin: false }).populate('likedProducts');
        // console.log(users);
        const userInfo = users.map(user => {
            return {
                name: user.username,
                email: user.email,
                likedProducts: user.likedProducts
            }
        })
        return userInfo;
    } catch (error) {
        console.error('Failed to fetch all users', error);
    }
}

const resetPassword = async (email, res) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        const resetToken = generateResetToken(user._id);
        res.cookie('resetToken', resetToken, { httpOnly: true, maxAge: 3600000 });
        sendPasswordResetEmail(user.email);
        
        return res.redirect('/');
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ message: 'Failed to process the request'});
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ADD,
        pass: EMAIL_PWD
    }
});

const sendPasswordResetEmail = (email, resetToken) => {
    // console.log(EMAIL_ADD)
    const mailOptions = {
        from: EMAIL_ADD,
        to: email,
        subject: 'Password Reset',
        html: `
        <p>Hello,</p>
        <p>You have requested to reset your password. Please click the link below to proceed:</p>
        <a href="http://localhost:3000/api/user/reset-password?token=${resetToken}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        `,
      };
    
    
      
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Password reset email error:', error);
        } else {
          console.log('Password reset email sent:', info.response);
        }
      });
}



module.exports = { reset, register, login, logout, getLikedProducts, getAllusers, resetPassword };