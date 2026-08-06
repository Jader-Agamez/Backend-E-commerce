const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DB_HOST) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: process.env.DB_PORT || 3306,
      logging: false,
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
