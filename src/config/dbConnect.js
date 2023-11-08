const mongoose = require('mongoose');
const { config } = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo.url);
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(`Error Al Conectar A MongoDB ${error.message}`);
    }
}

module.exports = { connectDB };

