const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../util/appError');
const { catchAsync } = require('../util/catchAsync');

exports.createProductValidation = [
    body('title')
        .isString()
        .withMessage('Title must be a string')
        .notEmpty()
        .withMessage('Must provide a title'),
    body('description')
        .isString()
        .withMessage('Description must be a string')
        .notEmpty()
        .withMessage('Must provide a description'),
    body('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .notEmpty()
        .withMessage('Must provide a quantity')
        .custom((value) => value > 0)
        .withMessage('Quantity must be a value greater than 0'),
    body('price')
        .isNumeric()
        .withMessage('Price must be a number')
        .notEmpty()
        .withMessage('Must provide a price')
        .custom((value) => value > 0)
        .withMessage('Price must be a value greater than 0')
];

exports.addProductValidator = [
    body('productId')
        .isNumeric()
        .withMessage('ProductId must be a number')
        .notEmpty()
        .withMessage('Must provide a productId'),
    body('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .notEmpty()
        .withMessage('Must provide a quantity')
        .custom((value) => value > 0)
        .withMessage('Quantity must be greater than 0')
];

exports.updateProductValidator = [
    body('productId')
        .isNumeric()
        .withMessage('ProductId must be a number')
        .notEmpty()
        .withMessage('Must provide a productId'),
    body('newQuantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .notEmpty()
        .withMessage('Must provide a quantity')
        .custom((value) => value > 0)
        .withMessage('Quantity must be greater than 0')
];

exports.validateResult = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMsgs = errors
            .array()
            .map(({ msg }) => msg)
            .join('. ');

        return next(new AppError(400, errorMsgs));
    }
    next();
});
