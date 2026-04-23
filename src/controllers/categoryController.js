const { Category, Product } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true } });
    res.json(categories);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'products', where: { isActive: true }, required: false }],
    });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    await category.update(req.body);
    res.json(category);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    await category.update({ isActive: false });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) { next(err); }
};
