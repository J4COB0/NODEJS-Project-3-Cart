const express = require('express');

// Controllers
const {
    addProductToCart,
    updateCart,
    deleteProductFromCart,
    doPurchase
} = require('../controllers/cart.controller');

// Middlewares
const { validateSession } = require('../middlewares/auth.middleware');
const { addProductValidator, updateProductValidator, validateResult } = require('../middlewares/validators.middleware');
const { cartExists } =require('../middlewares/cart.middleware');

const router = express.Router();

// Validation
router.use(validateSession);

// Protected routes
router.post('/add-product', addProductValidator, validateResult, addProductToCart);
router.patch('/update-cart', updateProductValidator, validateResult, cartExists, updateCart);
router.delete('/:productId', deleteProductFromCart);
router.post('/purchase', doPurchase);

module.exports = { cartRouter: router };
