require('dotenv').config();
const { sequelize, User, Category, Product } = require('../models');

const seed = async () => {
  await sequelize.sync({ force: true });
  console.log('📦 Tablas creadas');

  // Users
  const admin = await User.create({ name: 'Admin', email: 'admin@ecommerce.com', password: 'admin123', role: 'admin' });
  await User.create({ name: 'Juan Pérez', email: 'juan@example.com', password: 'cliente123', role: 'customer' });
  console.log('👤 Usuarios creados');

  // Categories
  const [electronics, clothing, home] = await Category.bulkCreate([
    { name: 'Electrónica', description: 'Dispositivos y gadgets' },
    { name: 'Ropa', description: 'Moda y accesorios' },
    { name: 'Hogar', description: 'Artículos para el hogar' },
  ]);
  console.log('📂 Categorías creadas');

  // Products
  await Product.bulkCreate([
    { name: 'Laptop Pro 15"', description: 'Laptop de alto rendimiento', price: 1299.99, stock: 15, sku: 'LAP-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    { name: 'Smartphone X12', description: 'Teléfono de última generación', price: 799.99, stock: 30, sku: 'PHO-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
    { name: 'Auriculares Bluetooth', description: 'Sonido premium inalámbrico', price: 149.99, stock: 50, sku: 'AUD-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { name: 'Camiseta Premium', description: 'Algodón 100% orgánico', price: 29.99, stock: 100, sku: 'CAM-001', categoryId: clothing.id, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
    { name: 'Jeans Slim Fit', description: 'Jeans modernos y cómodos', price: 59.99, stock: 75, sku: 'JEA-001', categoryId: clothing.id, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { name: 'Lámpara LED Moderna', description: 'Iluminación eficiente', price: 49.99, stock: 40, sku: 'LAM-001', categoryId: home.id, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
    { name: 'Silla Ergonómica', description: 'Comodidad para tu oficina', price: 299.99, stock: 20, sku: 'SIL-001', categoryId: home.id, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400' },
    { name: 'Tablet 10"', description: 'Pantalla Full HD', price: 399.99, stock: 25, sku: 'TAB-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' },
  ]);
  console.log('🛍️ Productos creados');
  console.log('\n✅ Seed completado!');
  console.log('📧 Admin: admin@ecommerce.com / admin123');
  console.log('📧 Cliente: juan@example.com / cliente123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
