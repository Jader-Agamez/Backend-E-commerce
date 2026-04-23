const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  image: { type: DataTypes.STRING(255) },
  sku: { type: DataTypes.STRING(50), unique: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'products' });

module.exports = Product;
