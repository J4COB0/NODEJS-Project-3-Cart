const dotenv = require('dotenv');

// Models
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');
const { filterObj } = require('../util/filterObj');

dotenv.config({ path: './config.env' });

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        where: { status: 'active' }
    });

    res.status(200).json({
        status: 'Success',
        data: { products }
    });
});

exports.getProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    const product = await Product.findOne({
        where: {
            id,
            status: 'active'
        }
    });

    if (!product) {
        return next(new AppError(404, 'Product not found'));
    }

    res.status(200).json({
        status: 'Success',
        data: { product }
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
    const { title, description, quantity, price } = req.body;
    const { id } = req.currentUser;

    const newProduct = await Product.create({
        title,
        description,
        quantity,
        price,
        userId: id
    });

    res.status(201).json({
        status: 'Success',
        data: { newProduct }
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { product } = req;

    const data = filterObj(
        req.body,
        'title',
        'description',
        'quantity',
        'price'
    );

    await product.update({ ...data });

    res.status(204).json({
        status: 'Success'
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req;

    await product.update({ status: 'deleted' });

    res.status(204).json({
        status: 'Success'
    });
});
