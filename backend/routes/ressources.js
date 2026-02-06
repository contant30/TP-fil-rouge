// routes/ressources.js
const express = require('express');
const router = express.Router();
const Ressource = require('../models').Ressource;

router.get('/', async (req, res) => {
  const ressources = await Ressource.findAll();
  res.json({ success: true, data: ressources });
});

router.get('/:id', async (req, res) => {
  const ressource = await Ressource.findByPk(req.params.id);
  if (!ressource) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ success: true, data: ressource });
});

module.exports = router;
