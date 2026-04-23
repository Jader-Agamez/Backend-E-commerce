const { User, Order } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const { name, email, role, isActive, phone, address } = req.body;
    await user.update({ name, email, role, isActive, phone, address });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    await user.update({ isActive: false });
    res.json({ message: 'Usuario desactivado' });
  } catch (err) { next(err); }
};
