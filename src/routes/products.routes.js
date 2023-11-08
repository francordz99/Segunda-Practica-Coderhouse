const express = require('express');
const router = express.Router();
const ProductsManager = require('../../dao/mongodb/productManager');

const productsManager = new ProductsManager();

router.get('/', async (req, res) => {
    try {
        let { limit, page, sort } = req.query;
        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;

        let query = req.query.query;  // Ajuste para obtener el parámetro "query"

        const products = await productsManager.getProducts(limit, page, query, sort);

        const totalProducts = await productsManager.getTotalProducts({});  // Se busca total sin filtros
        const totalPages = Math.ceil(totalProducts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevLink = hasPrevPage ? `${req.baseUrl}?page=${page - 1}&limit=${limit}&query=${query}` : null;
        const nextLink = hasNextPage ? `${req.baseUrl}?page=${page + 1}&limit=${limit}&query=${query}` : null;

        const result = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

router.get('/:productCode', async (req, res) => {
    try {
        const product = await productsManager.updateProductByCode(req.params.productCode);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado o inexistente.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const newProduct = {
            title,
            description,
            code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category,
            thumbnails: thumbnails || [],
        };

        await productsManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el producto.' });
    }
});

router.put('/:productCode', async (req, res) => {
    try {
        const productCode = req.params.productCode;
        const updatedFields = req.body;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ error: 'Ningún campo proporcionado para actualizar.' });
        }

        await productsManager.updateProductByCode(productCode, updatedFields);
        res.status(200).json({ message: 'Producto actualizado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

router.delete('/by-code/:productCode', async (req, res) => {
    try {
        const productCode = req.params.productCode;

        await productsManager.deleteProductByCode(productCode);

        res.json({ message: 'Producto eliminado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto.' });
    }
});

module.exports = router;
