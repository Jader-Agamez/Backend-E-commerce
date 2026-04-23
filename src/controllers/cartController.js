const { Cart, Product } = require('../models');

exports.getCart = async (req, res, next) => {
  try {
    const items = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'price', 'image', 'stock'] }],
    });
    res.json(items);
  } catch (err) { next(err); }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Producto no encontrado' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Stock insuficiente' });

    const [item, created] = await Cart.findOrCreate({
      where: { userId: req.user.id, productId },
      defaults: { quantity },
    });

    if (!created) await item.update({ quantity: item.quantity + quantity });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const item = await Cart.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    if (req.body.quantity <= 0) {
      await item.destroy();
      return res.json({ message: 'Item eliminado' });
    }
    await item.update({ quantity: req.body.quantity });
    res.json(item);
  } catch (err) { next(err); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const item = await Cart.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    await item.destroy();
    res.json({ message: 'Item eliminado' });
  } catch (err) { next(err); }
};

exports.clearCart = async (req, res, next) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    res.json({ message: 'Carrito vaciado' });
  } catch (err) { next(err); }
};
