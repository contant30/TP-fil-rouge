// server.js - TP Fil Rouge ANTI-CRASH
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));



// 🔥 Routes
app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/salles', require('./routes/salles'));
app.use('/api/ressources', require('./routes/ressources'));
app.use('/api/reservations', require('./routes/reservations'));

// 🧪 Status
app.get('/status', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 API Réservation Salles LIVE !', 
    timestamp: new Date().toISOString(),
    endpoints: [
      '✅ POST /api/utilisateurs/register',
      '✅ POST /api/utilisateurs/login → TOKEN',
      '✅ GET /api/salles (Bearer)',
      '🔄 POST /api/reservations'
    ]
  });
});

// 🛡️ 404 + Errors
app.use('*', (req, res) => res.status(404).json({ error: `Route ${req.originalUrl} non trouvée` }));
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// 🚀 DB SAFE (NO SYNC ALTER !)
sequelize.authenticate({ timeout: 10000 })
  .then(async () => {
    console.log('✅ DB Connectée (MySQL) - Tables manuelles OK');
    
    // Sync OPTIONNEL léger (dev only)
    try {
      await sequelize.sync({ alter: false });  // ✅ Pas ALTER destructif
      console.log('✅ Tables vérifiées');
    } catch (syncErr) {
      console.warn('⚠️ Sync SKIP (tables existantes):', syncErr.message);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
      console.log(`📱 Test: http://localhost:${PORT}/status`);
    });
  })
  .catch(err => {
    console.error('❌ DB Connect FAIL:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  });

module.exports = app;
