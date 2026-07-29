const request = require('supertest');
const { sequelize, User, Category, Product, Cart } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await User.create({ name: 'Test User', email: 'test@example.com', password: 'password123', role: 'customer' });

  const category = await Category.create({ name: 'Test Category', description: 'Category for tests' });
  await Product.create({
    name: 'Test Product',
    description: 'Product used in tests',
    price: 25.5,
    stock: 10,
    sku: 'TEST-001',
    categoryId: category.id,
    image: 'https://example.com/product.jpg',
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Critical flow', () => {
  let token;

  it('logs in a customer and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('lists products', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('adds a product to the cart', async () => {
    const product = await Product.findOne({ where: { name: 'Test Product' } });

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.quantity).toBe(2);
  });

  it('creates an order from the cart', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shippingAddress: 'Calle 123',
        paymentMethod: 'card',
        cardNumber: '4111111111111111',
        cardHolder: 'Test User',
      });

    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.paymentId).toBeDefined();
  });

  it('persists the order for the customer', async () => {
    const res = await request(app)
      .get('/api/orders/my')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
