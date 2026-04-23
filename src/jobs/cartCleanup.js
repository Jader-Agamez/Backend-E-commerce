const cron = require('node-cron');
const { Cart } = require('../models');
const { Op } = require('sequelize');

// Runs every day at midnight - deletes carts not updated in 7 days
const startCartCleanup = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const deleted = await Cart.destroy({ where: { updatedAt: { [Op.lt]: sevenDaysAgo } } });
      console.log(`[CRON] Carritos abandonados eliminados: ${deleted}`);
    } catch (err) {
      console.error('[CRON] Error en limpieza de carritos:', err.message);
    }
  });
  console.log('[CRON] Tarea de limpieza de carritos iniciada');
};

module.exports = { startCartCleanup };
