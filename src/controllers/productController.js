const { Op } = require('sequelize');
const { Product, Category } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { search, categoryId, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const where = { isActive: true };

    if (search) where.name = { [Op.like]: `%${search}%` };
    if (categoryId) where.categoryId = categoryId;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({ products: rows, total: count, page: parseInt(page), pages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, isActive: true },
      include: [{ model: Category, as: 'category' }],
    });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    await product.update(req.body);
    res.json(product);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    await product.update({ isActive: false });
    res.json({ message: 'Producto eliminado' });
  } catch (err) { next(err); }
};
