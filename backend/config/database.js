// config/database.js - Configuration Sequelize
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tp_fil_rouge', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: false, // Désactive les logs SQL
});

// Test connexion
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connecté'))
  .catch(err => console.error('❌ Sequelize erreur:', err));

module.exports = sequelize;
