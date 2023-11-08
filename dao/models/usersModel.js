const mongoose = require('mongoose');
const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email: { type: String, unique: true },
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
    role: { type: String, default: 'user' },
});

module.exports = {
    usersModel: mongoose.model(usersCollection, userSchema)
}
