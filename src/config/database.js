const { Sequelize } = require('sequelize');

// Only load .env if not in test mode (setup.js handles test config)
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config();
}

let sequelize;

// In test mode, always use SQLite to avoid destroying production data
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else if (process.env.DB_HOST) {
  // MySQL configuration for production
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: process.env.NODE_ENV === 'production' ? false : console.log,
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      pool: {
        max: parseInt(process.env.DB_POOL_MAX) || 10,
        min: parseInt(process.env.DB_POOL_MIN) || 2,
        acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
        idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
      },
      retry: {
        max: 3
      }
    }
  );
} else {
  // SQLite for development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
  });
}

module.exports = sequelize;
