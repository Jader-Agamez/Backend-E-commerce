require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { sequelize, User, Category, Product } = require('../models');

const seed = async () => {
  try {
    // First sync without force to create tables if they don't exist
    await sequelize.sync();
    console.log('📦 Tablas sincronizadas');

    // Check if tables are empty
    const userCount = await User.count();
    const categoryCount = await Category.count();
    const productCount = await Product.count();

    // Only seed if tables are empty
    if (userCount === 0 && categoryCount === 0 && productCount === 0) {
      // Users
      const admin = await User.create({ name: 'Admin', email: 'admin@ecommerce.com', password: 'admin123', role: 'admin', isActive: true });
      await User.create({ name: 'Juan Pérez', email: 'juan@example.com', password: 'cliente123', role: 'customer', isActive: true });
      console.log('👤 Usuarios creados');

      // Categories
      const [electronics, clothing, home] = await Category.bulkCreate([
        { name: 'Electrónica', description: 'Dispositivos y gadgets', isActive: true },
        { name: 'Ropa', description: 'Moda y accesorios', isActive: true },
        { name: 'Hogar', description: 'Artículos para el hogar', isActive: true },
      ]);
      console.log('📂 Categorías creadas');

      // Products
      await Product.bulkCreate([
        { name: 'Laptop Pro 15"', description: 'Laptop de alto rendimiento', price: 1299.99, stock: 15, sku: 'LAP-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', isActive: true },
        { name: 'Smartphone X12', description: 'Teléfono de última generación', price: 799.99, stock: 30, sku: 'PHO-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', isActive: true },
        { name: 'Auriculares Bluetooth', description: 'Sonido premium inalámbrico', price: 149.99, stock: 50, sku: 'AUD-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', isActive: true },
        { name: 'Camiseta Premium', description: 'Algodón 100% orgánico', price: 29.99, stock: 100, sku: 'CAM-001', categoryId: clothing.id, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', isActive: true },
        { name: 'Jeans Slim Fit', description: 'Jeans modernos y cómodos', price: 59.99, stock: 75, sku: 'JEA-001', categoryId: clothing.id, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', isActive: true },
        { name: 'Lámpara LED Moderna', description: 'Iluminación eficiente', price: 49.99, stock: 40, sku: 'LAM-001', categoryId: home.id, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', isActive: true },
        { name: 'Silla Ergonómica', description: 'Comodidad para tu oficina', price: 299.99, stock: 20, sku: 'SIL-001', categoryId: home.id, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400', isActive: true },
        { name: 'Tablet 10"', description: 'Pantalla Full HD', price: 399.99, stock: 25, sku: 'TAB-001', categoryId: electronics.id, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', isActive: true },
      ]);
      console.log('🛍️ Productos creados');
      console.log('\n✅ Seed completado!');
      console.log('📧 Admin: admin@ecommerce.com / admin123');
      console.log('📧 Cliente: juan@example.com / cliente123');
    } else {
      console.log('📋 Datos ya existen, omitiendo seed');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  }
};

seed().catch((err) => { console.error(err); process.exit(1); });
