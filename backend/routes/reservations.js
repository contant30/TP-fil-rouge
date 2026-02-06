// routes/reservations.js - Complexe avec checks conflits
const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservationService');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const reservations = await reservationService.getAll(req.query);
  res.json(reservations);
});

router.get('/:id', async (req, res) => {
  const reservation = await reservationService.getById(req.params.id, req.user.id);
  res.json(reservation);
});

router.post('/', async (req, res) => {
  const reservation = await reservationService.create({ ...req.body, utilisateurId: req.user.id });
  res.status(201).json(reservation);
});

router.put('/:id', async (req, res) => {
  const reservation = await reservationService.update(req.params.id, req.body, req.user.id);
  res.json(reservation);
});

router.delete('/:id', async (req, res) => {
  await reservationService.delete(req.params.id, req.user.id);
  res.json({ message: 'Réservation annulée' });
});

module.exports = router;
