const mongoose = require('mongoose');
const usersCollection = "users";

const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    email: String,
    contrasena: String,
    rol: String
});

module.exports = {
    usersModel: mongoose.model(usersCollection, userSchema)
}
