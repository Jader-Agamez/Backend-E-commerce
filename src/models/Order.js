const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shippingAddress: { type: DataTypes.TEXT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING(50), defaultValue: 'card' },
  paymentId: { type: DataTypes.STRING(100) },
  invoicePath: { type: DataTypes.STRING(255) },
  notes: { type: DataTypes.TEXT },
}, { tableName: 'orders' });

module.exports = Order;
