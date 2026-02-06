const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');
const { validationResult } = require('express-validator');
const UtilisateurService = require('../services/utilisateurService');

exports.createUtilisateur = async (req, res) => {
  try {
    const result = await UtilisateurService.createUtilisateur(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: ['id_utilisateur', 'nom_utilisateur', 'email', 'role']
    });
    res.json({ success: true, data: utilisateurs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

exports.getUtilisateurById = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id, {
      attributes: ['id_utilisateur', 'nom_utilisateur', 'email', 'role']
    });
    if (!utilisateur) return res.status(404).json({ success: false, error: 'NOT_FOUND' });
    res.json({ success: true, data: utilisateur });
  } catch (error) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

exports.updateUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) return res.status(404).json({ success: false, error: 'NOT_FOUND' });

    if (req.body.mot_de_passe) {
      req.body.mot_de_passe = await bcrypt.hash(req.body.mot_de_passe, 12);
    }
    
    await utilisateur.update(req.body);
    res.json({ success: true, data: utilisateur });
  } catch (error) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

exports.deleteUtilisateur = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);
    if (!utilisateur) return res.status(404).json({ success: false, error: 'NOT_FOUND' });
    await utilisateur.destroy();
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};
