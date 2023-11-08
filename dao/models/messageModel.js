const mongoose = require('mongoose');

const { Schema } = mongoose;
const messageCollection = "messages";

const messageSchema = new Schema({
    sender: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
});

const MessageModel = mongoose.model(messageCollection, messageSchema);

module.exports = MessageModel;