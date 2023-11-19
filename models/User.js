const mongoose = require('mongoose');
const refType = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    likedProducts: [
        {
            type: refType,
            ref: 'Product'
        }
    ]

})

const User = mongoose.model("User", UserSchema);
module.exports = User;