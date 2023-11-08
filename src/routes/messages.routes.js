const express = require('express');
const router = express.Router();
const MessageManager = require('../../dao/mongodb/messageManager');

const messageManager = new MessageManager();

router.get('/', async (req, res) => {
    try {
        const messages = await messageManager.getAllMessages();
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener todos los mensajes.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { sender, content } = req.body;

        if (!sender || !content) {
            return res.status(400).json({ error: 'Sender and content are required.' });
        }

        const newMessage = await messageManager.addMessage(sender, content);
        res.status(201).json({ message: 'Mensaje agregado con éxito.', newMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el mensaje.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageManager.getMessageById(id);

        if (message) {
            res.json(message);
        } else {
            res.status(404).json({ error: 'Mensaje no encontrado o inexistente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el mensaje.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;

        const updatedMessage = await messageManager.updateMessage(id, updatedFields);

        if (updatedMessage) {
            res.json({ message: 'Mensaje actualizado con éxito.' });
        } else {
            res.status(404).json({ error: 'Mensaje no encontrado o inexistente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el mensaje.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await messageManager.deleteMessage(id);
        res.json({ message: 'Mensaje eliminado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el mensaje.' });
    }
});

module.exports = router;
