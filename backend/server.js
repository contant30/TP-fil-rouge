// server.js - TP Fil Rouge FINAL
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🔥 Routes spécifiques (PAS /api global)
app.use('/api/utilisateurs', require('./routes/utilisateurs'));
app.use('/api/salles', require('./routes/salles'));
app.use('/api/ressources', require('./routes/ressources'));
app.use('/api/reservations', require('./routes/reservations'));

// Test API (PAS /api - conflit évité)
app.get('/status', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 API Réservation Salles OK !', 
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/utilisateurs/register',
      'POST /api/utilisateurs/login',
      'GET /api/utilisateurs (Bearer token)'
    ]
  });
});

// DB + Serveur
sequelize.authenticate()
  .then(() => {
    console.log('✅ DB Connectée');
    console.log('✅ Tables Sync (dev)');
    app.listen(PORT, () => {
      console.log(`🚀 http://localhost:${PORT}`);
      console.log(`📱 Test: http://localhost:${PORT}/status`);
    });
  })
  .catch(err => console.error('❌ DB:', err.message));
