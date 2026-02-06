// services/ressourceService.js
const { Ressource } = require('../models');

class RessourceService {
  static async getAllRessources() {
    return await Ressource.findAll();
  }

  static async getRessourceById(id) {
    const ressource = await Ressource.findByPk(id);
    if (!ressource) throw new Error('RESSOURCE_NOT_FOUND');
    return ressource;
  }

  static async isRessourceDisponible(id, quantite = 1) {
    const ressource = await Ressource.findByPk(id);
    if (!ressource) throw new Error('RESSOURCE_NOT_FOUND');
    return ressource.estDisponible(quantite);
  }
}

module.exports = RessourceService;
