const { DataTypes } = require('sequelize');

// Utils
const { sequelize } = require('../util/database');

const Cart = sequelize.define('cart', {
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
    status: {
        type: DataTypes.STRING(10),
        defaultValue: 'active',
        allowNull: false
    }
});

module.exports = { Cart };