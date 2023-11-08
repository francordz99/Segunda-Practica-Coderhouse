const Cart = require('../models/cartModel');

async function createCart() {
    try {
        const cart = new Cart({
            products: []
        });
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al crear el carrito: ' + error.message);
    }
}

async function getCartById(cartId) {
    try {
        const cart = await Cart.findById(cartId).populate('products.product').exec();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    } catch (error) {
        throw new Error('Error al obtener el carrito: ' + error.message);
    }
}

async function addProductToCart(cartId, productId, quantity) {
    try {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.product.equals(productId));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            const productToAdd = {
                product: productId,
                quantity: quantity
            };
            cart.products.push(productToAdd);
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al agregar producto al carrito: ' + error.message);
    }
}

async function removeProductFromCart(cartId, productId) {
    try {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = cart.products.filter(product => !product.product.equals(productId));
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al eliminar producto del carrito: ' + error.message);
    }
}

async function updateCart(cartId, products) {
    try {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = products;
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al actualizar el carrito: ' + error.message);
    }
}

async function updateProductQuantity(cartId, productId, quantity) {
    try {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.product && product.product.equals(productId));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al actualizar la cantidad del producto: ' + error.message);
    }
}


async function removeAllProductsFromCart(cartId) {
    try {
        const cart = await Cart.findById(cartId).exec();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = [];
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al eliminar todos los productos del carrito: ' + error.message);
    }
}

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    removeAllProductsFromCart
};