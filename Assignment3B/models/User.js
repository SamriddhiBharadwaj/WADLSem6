const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: { type: String, unique: true },
    password: String,
    address: String,
    city: String,
    hobbies: String,
    gender: String
});

module.exports = mongoose.model('User', userSchema);