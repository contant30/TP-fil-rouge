const express = require('express');
const router = express.Router();
const salleService = require('../services/salleService');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const salles = await salleService.getAllSalles();  // ← getAllSalles()
    res.json(salles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const salle = await salleService.getSalleById(req.params.id);  // ← getSalleById()
    res.json(salle);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const salle = await salleService.createSalle(req.body);  // ← createSalle()
    res.status(201).json(salle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const salle = await salleService.updateSalle(req.params.id, req.body);  // ← updateSalle()
    res.json(salle);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await salleService.deleteSalle(req.params.id);  // ← deleteSalle()
    res.json({ message: 'Salle supprimée' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
