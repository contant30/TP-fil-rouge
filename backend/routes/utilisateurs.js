// routes/utilisateurs.js
const express = require('express');
const router = express.Router();
const utilisateurService = require('../services/utilisateurService'); // Tes services

// Public: Inscription
router.post('/register', async (req, res) => {
  try {
    const user = await utilisateurService.createUtilisateur(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Public: Login
router.post('/login', async (req, res) => {
  try {
    const { token, user } = await utilisateurService.login(req.body);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Privé: CRUD
router.use(require('../middleware/auth')); // Guard après public

router.get('/', async (req, res) => {
  const users = await utilisateurService.getAll();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await utilisateurService.getById(req.params.id);
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const user = await utilisateurService.update(req.params.id, req.body);
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  await utilisateurService.delete(req.params.id);
  res.json({ message: 'Supprimé' });
});

module.exports = router;
