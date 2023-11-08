const express = require('express');
const router = express.Router();
const handlebars = require('handlebars');
const cartManager = require('../../dao/mongodb/cartManager');
const Cart = require('../../dao/models/cartModel');

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cartId/products/:productId', async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const quantity = req.body.quantity || 1;

    try {
        const cart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await Cart.findById(cartId).populate('products.product').lean();
        res.render('carts', { cart });
    } catch (error) {
        res.status(500).send('Error al obtener el carrito: ' + error.message);
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;

    try {
        const cart = await cartManager.removeProductFromCart(cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cartId', async (req, res) => {
    const cartId = req.params.cartId;
    const products = req.body.products;

    try {
        const cart = await cartManager.updateCart(cartId, products);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cartId/products/:productId/:quantity', async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity, 10);

    try {
        const cart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:cartId', async (req, res) => {
    const cartId = req.params.cartId;

    try {
        const cart = await cartManager.removeAllProductsFromCart(cartId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
