const dotenv = require('dotenv');

// Models
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { ProductInCart } = require('../models/productInCart');

// Utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/appError');

dotenv.config({ path: './config.env' });

exports.addProductToCart = catchAsync(async (req, res, next) => {
    const { currentUser } = req;
    const { productId, quantity } = req.body;

    const product = await Product.findOne({ where: { id: productId, status: 'active' } });

    // If product doesn't exist
    if (!product) {
        return next(new AppError(400, 'Product not found, invalid ID'));
    }

    // If quantity is greater than quantity of availables products
    if (quantity > product.quantity) {
        return next(
            new AppError(400, 'Quantity excess, the amount of available products is less')
        );
    }

    const cart = await Cart.findOne({
        where: { userId: currentUser.id, status: 'active' }
    });

    if (!cart) {
        // If cart doesn't exist
        const newCart = await Cart.create({ userId: currentUser.id });

        await ProductInCart.create({
            productId,
            cartId: newCart.id,
            quantity
        });
    } else {
        // If cart exist
        const productExists = await ProductInCart.findOne({
            where: { cartId: cart.id, productId }
        });

        if (productExists && productExists.status === 'active') {
            return next(new AppError(400, 'This product is already in the cart'));
        }

        // If product is in the cart but was removed before, add it again
        if (productExists && productExists.status === 'removed') {
            await productExists.update({ status: 'active', quantity });
        }

        // Add new product to cart
        if (!productExists) {
            await ProductInCart.create({ cartId: cart.id, productId, quantity });
        }
    }

    res.status(200).json({
        status: 'Success'
    });
});

exports.updateCart = catchAsync(async (req, res, next) => {
    const { productId, newQty } = req.body;

    const product = Product.findOne({ where: { id: productId } });
    if (!product) {
        return next(new AppError(400, 'Product not found, invalid ID'));
    }

    if (newQty > product.quantity) {
        return next(
            new AppError(400, 'Quantity excess, no availables product to do this request')
        );
    }

    const cart = await Cart.findOne({
        where: { status: 'active', userId: currentUser.id }
    });
    if (!cart) {
        return next(new AppError(400, 'No car for this user'));
    }

    const productInCart = await ProductInCart.findOne({
        where: { cartId: cart.id, productId, status: 'active' }
    });
    if (!productInCart) {
        return next(new AppError(404, 'Can not update this product, is not in the cart'));
    }

    let status = 'active';
    if (newQty === 0) status = 'removed';

    product.update({ quantity: newQty, status });

    res.status(200).json({ status: 'Success' });
});

exports.deleteProductFromCart = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({
        where: { status: 'active', userId: currentUser.id }
    });
    if (!cart) {
        return next(new AppError(400, 'No car for this user'));
    }

    const productInCart = await ProductInCart.findOne({
        where: { status: 'active', cartId: cart.id, productId }
    });
    if (!productInCart) {
        return next(400, 'This product does not exist in this cart');
    }

    await productInCart.update({ status: 'removed' });

    res.status(204).json({ status: 'success' });
});

exports.doPurchase = catchAsync(async (req, res, next) => {
    const { currentUser } = req;

    const cart = await Cart.findOne({
        where: { status: 'active', userId: currentUser.id },
        include: [
            {
                model: Product,
                through: { where: { status: 'active' } }
            }
        ]
    });

    if (!cart) {
        return next(new AppError(400, 'No car for this user'));
    }

    let totalPrice = 0;

    const cartPromises = cart.products.map(async (product) => {
        await product.productInCart.update({ status: 'purchased' });

        const productPrice = product.price * product.productInCart.quantity;

        totalPrice += productPrice;

        const newQty = product.quantity - product.productInCart.quantity;

        return await product.update({ quantity: newQty });
    });

    await Promise.all(cartPromises);

    // Mark cart as purchased
    await cart.update({ status: 'purchased' });

    const newOrder = await Order.create({
        userId: currentUser.id,
        cartId: cart.id,
        issuedAt: new Date().toLocaleString(),
        totalPrice
    });

    res.status(201).json({
        status: 'success',
        data: { newOrder }
    });
});