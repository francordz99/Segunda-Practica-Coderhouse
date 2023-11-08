
const ProductModel = require('../models/productModel');

class ProductsManager {
    constructor() { }

    async readProductsFromDatabase() {
        try {
            return await ProductModel.find().lean();
        } catch (error) {
            console.error('Error al leer productos de la base de datos:', error);
            throw error;
        }
    }

    async writeProductsToDatabase(products) {
        try {
            await ProductModel.insertMany(products);
        } catch (error) {
            console.error('Error al escribir productos en la base de datos:', error);
            throw error;
        }
    }

    async getTotalProducts(filters) {
        try {
            return await ProductModel.countDocuments(filters);
        } catch (error) {
            console.error('Error al obtener el total de productos:', error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const lastProduct = await ProductModel.findOne().sort({ _id: -1 });
            const lastProductCode = lastProduct ? parseInt(lastProduct.code.substr(4)) : 0;
            product.code = `CODE${String(lastProductCode + 1).padStart(3, '0')}`;
            await ProductModel.create(product);
        } catch (error) {
            console.error('Error al agregar un producto:', error);
            throw error;
        }
    }

    async getProducts(limit, page, query, sort) {
        try {
            let queryOptions = {};

            if (query) {
                queryOptions.$or = [
                    { title: { $regex: new RegExp(query, 'i') } },
                    { category: { $regex: new RegExp(query, 'i') } }
                ];
            }

            const sortOptions = sort && (sort.toLowerCase() === 'desc') ? { price: -1 } : { price: 1 };

            const products = await ProductModel.find(queryOptions)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(sortOptions);

            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async updateProductByCode(code, updatedFields) {
        try {
            const updatedProduct = await ProductModel.findOneAndUpdate(
                { code: code },
                { $set: updatedFields },
                { new: true }
            );

            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }

    async deleteProductByCode(code) {
        try {
            await ProductModel.findOneAndDelete({ code: code });
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }
}

module.exports = ProductsManager;
