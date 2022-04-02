const express = require('express');

// Controllers
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

// Middlewares
const { validateSession } = require('../middlewares/auth.middleware');
const { createProductValidation, validateResult } = require('../middlewares/validators.middleware');
const { productExists, productOwner } = require('../middlewares/products.middleware');

const router = express.Router();

// Validation 
router.use(validateSession);

// Protected routes
router.post('/', createProductValidation, validateResult, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.patch('/:id', productExists, productOwner, updateProduct);
router.delete('/:id', productExists, productOwner, deleteProduct);

module.exports = { productsRouter: router };