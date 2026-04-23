require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const { startCartCleanup } = require('./jobs/cartCleanup');

const app = express();

// Security & middleware
app.use(helmet());
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Static files (invoices)
app.use('/invoices', express.static('invoices'));

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de datos sincronizada');
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  startCartCleanup();
}).catch((err) => {
  console.error('❌ Error al conectar DB:', err.message);
  process.exit(1);
});

module.exports = app;
