const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const token = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    return token;
}

const generateNameToken = (id, name) => {
    const token = jwt.sign({id, name}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    return token;
}

const decodeToken = (token) => {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decodedToken.id;
}

const decodeResetToken = (token) => {
    const decodedToken = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    return decodedToken.id;
}

const generateResetToken = (id) => {
    const token = jwt.sign({ id }, process.env.RESET_TOKEN_SECRET, {
        expiresIn: '10m'
    });
    return token;
}

module.exports = {generateToken, generateNameToken, decodeToken, decodeResetToken, generateResetToken};