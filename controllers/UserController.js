const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    const { username, email, password , confirmPwd} = req.body;
 
    try {
        const existingUsername = await User.findOne({username}); 
        const existingEmail = await User.findOne({email});
        if (existingUsername || existingEmail) {
            return res.status(409).json({ message: 'User already exists'});
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

        // return res.redirect('/', { token });
        return res.status(201).json({ token });
    } catch(error) {
        console.error('Failed to register:', error);
        return res.status(500),json({ message: error.message });
    }
    
};

    const login = async (req, res) => {
        const { username, password } = req.body;
  
        try {
        const user = await User.findOne({ username });
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

    const logout = (_req, res) => {
        try {
            res.clearCookie('token');
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    };

module.exports = { register, login, logout };