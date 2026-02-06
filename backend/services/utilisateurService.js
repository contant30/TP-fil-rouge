// services/utilisateurService.js - Fonctions directes
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_tp_fil_rouge_2026';

const createUtilisateur = async (data) => {
  const { nom_utilisateur, email, mot_de_passe } = data;
  if (!nom_utilisateur || !email || !mot_de_passe) {
    throw new Error('Champs obligatoires manquants');
  }
  const existing = await Utilisateur.findOne({ where: { email } });
  if (existing) throw new Error('Email déjà utilisé');
  const hashed = await bcrypt.hash(mot_de_passe, 12);
  return Utilisateur.create({ nom_utilisateur, email, mot_de_passe: hashed });
};

const login = async ({ email, mot_de_passe }) => {
  const user = await Utilisateur.findOne({ where: { email } });
  if (!user || !await bcrypt.compare(mot_de_passe, user.mot_de_passe)) {
    throw new Error('Email ou mot de passe incorrect');
  }
  const token = jwt.sign({ id_utilisateur: user.id_utilisateur }, JWT_SECRET, { expiresIn: '24h' });
  return { token, user: { id_utilisateur: user.id_utilisateur, nom_utilisateur: user.nom_utilisateur, email: user.email } };
};

const getAll = async () => {
  return Utilisateur.findAll({ attributes: ['id_utilisateur', 'nom_utilisateur', 'email'] });
};

const getById = async (id) => {
  const user = await Utilisateur.findByPk(id, { attributes: ['id', 'nom_utilisateur', 'email'] });
  if (!user) throw new Error('Utilisateur non trouvé');
  return user;
};

const update = async (id, data) => {
  const user = await Utilisateur.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (data.mot_de_passe) data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, 12);
  await user.update(data);
  return user;
};

const deleteUser = async (id) => {  // Renommé pour éviter mot-clé
  const user = await Utilisateur.findByPk(id);
  if (!user) throw new Error('Utilisateur non trouvé');
  await user.destroy();
};

// ✅ Export objet direct
module.exports = {
  createUtilisateur,
  login,
  getAll,
  getById,
  update,
  deleteUser
};
