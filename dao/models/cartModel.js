const mongoose = require('mongoose');
const Product = require('./productModel');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

cartSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.products = ret.products.map(product => ({
            product: product.product,
            quantity: product.quantity
        }));
        return ret;
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
