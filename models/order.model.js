const { DataTypes } = require('sequelize');

// Utils
const { sequelize } = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cartId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    issuedAt: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(10),
        defaultValue: 'active',
        allowNull: false
    }
});

module.exports = { Order };