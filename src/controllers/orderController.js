const { Order, OrderItem, Product, Cart, User } = require('../models');
const { processPayment } = require('../services/paymentService');
const { generateInvoice } = require('../services/pdfService');
const { sendOrderConfirmation } = require('../services/emailService');
const sequelize = require('../config/database');

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { shippingAddress, paymentMethod = 'card', cardNumber, cardHolder, notes } = req.body;

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'product' }],
    });
    if (!cartItems.length) return res.status(400).json({ message: 'El carrito está vacío' });

    // Validate stock and calculate total
    let total = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity)
        return res.status(400).json({ message: `Stock insuficiente para ${item.product.name}` });
      total += parseFloat(item.product.price) * item.quantity;
    }

    // Process payment
    const payment = await processPayment({ amount: total, cardNumber, cardHolder });
    if (!payment.success) {
      await t.rollback();
      return res.status(402).json({ message: payment.message });
    }

    // Create order
    const order = await Order.create(
      { userId: req.user.id, total, shippingAddress, paymentMethod, paymentId: payment.paymentId, status: 'paid', notes },
      { transaction: t }
    );

    // Create order items and update stock
    const items = await Promise.all(
      cartItems.map(async (item) => {
        await item.product.update({ stock: item.product.stock - item.quantity }, { transaction: t });
        return OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
          subtotal: parseFloat(item.product.price) * item.quantity,
        }, { transaction: t });
      })
    );

    // Clear cart
    await Cart.destroy({ where: { userId: req.user.id }, transaction: t });
    await t.commit();

    // Load full order for PDF/email
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });

    // Generate invoice and send email asynchronously
    generateInvoice(fullOrder, req.user)
      .then((path) => order.update({ invoicePath: path }))
      .catch(console.error);

    sendOrderConfirmation(fullOrder, req.user).catch(console.error);

    res.status(201).json({ order: fullOrder, paymentId: payment.paymentId });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;

    const order = await Order.findOne({
      where,
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
  } catch (err) { next(err); }
};

// Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
    });
    res.json({ orders: rows, total: count });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    await order.update({ status: req.body.status });
    res.json(order);
  } catch (err) { next(err); }
};
