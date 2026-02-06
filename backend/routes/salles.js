// routes/salles.js
const express = require('express');
const router = express.Router();
const salleService = require('../services/salleService');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const salles = await salleService.getAll();
  res.json(salles);
});

router.get('/:id', async (req, res) => {
  const salle = await salleService.getById(req.params.id);
  res.json(salle);
});

router.post('/', async (req, res) => {
  const salle = await salleService.create(req.body);
  res.status(201).json(salle);
});

router.put('/:id', async (req, res) => {
  const salle = await salleService.update(req.params.id, req.body);
  res.json(salle);
});

router.delete('/:id', async (req, res) => {
  await salleService.delete(req.params.id);
  res.json({ message: 'Salle supprimée' });
});

module.exports = router;
