const MessageModel = require('../models/messageModel');

class MessageManager {
    constructor() {
    }

    async getAllMessages() {
        try {
            return await MessageModel.find();
        } catch (error) {
            console.error("Error al obtener todos los mensajes:", error);
            throw error;
        }
    }

    async addMessage(sender, content) {
        try {
            const newMessage = await MessageModel.create({ sender, content });
            return newMessage;
        } catch (error) {
            console.error("Error al agregar un mensaje:", error);
            throw error;
        }
    }

    async getMessageById(id) {
        try {
            return await MessageModel.findById(id);
        } catch (error) {
            console.error("Error al obtener mensaje por ID:", error);
            throw error;
        }
    }

    async updateMessage(id, updatedFields) {
        try {
            const updatedMessage = await MessageModel.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
            return updatedMessage;
        } catch (error) {
            console.error("Error al actualizar mensaje:", error);
            throw error;
        }
    }

    async deleteMessage(id) {
        try {
            await MessageModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error al eliminar mensaje:", error);
            throw error;
        }
    }
}

module.exports = MessageManager;
