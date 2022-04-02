const express = require('express');

// Controllers
const {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAllProducts,
    getAllOrders,
    getOrderById,
    loginUser
} = require('../controllers/users.controller');

// Middlewares
const { validateSession } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getAllUsers);

// Routes
router.post('/', createUser);
router.post('/login', loginUser);

// Validation 
router.use(validateSession);

// Protected routes
router.get('/me', getAllProducts);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);

module.exports = { usersRouter: router };
