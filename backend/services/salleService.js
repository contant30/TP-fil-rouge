const { Salle, Reservation } = require('../models');
const { Op, sequelize } = require('sequelize');

class SalleService {
  // 📋 READ
  static async getAllSalles() {
    return await Salle.findAll({ order: [['nom', 'ASC']] });
  }

  static async getSalleById(id) {
    const salle = await Salle.findByPk(id, { 
      include: ['ressources']  // Optionnel: salles avec ressources
    });
    if (!salle) throw new Error('SALLE_NOT_FOUND');
    return salle;
  }

  // ➕ CREATE
  static async createSalle(data) {
    return await Salle.create(data);
  }

  // ✏️ UPDATE
  static async updateSalle(id, data) {
    const salle = await Salle.findByPk(id);
    if (!salle) throw new Error('SALLE_NOT_FOUND');
    return await salle.update(data);
  }

  // 🗑️ DELETE
  static async deleteSalle(id) {
    const salle = await Salle.findByPk(id);
    if (!salle) throw new Error('SALLE_NOT_FOUND');
    await salle.destroy();
    return { deleted: true };
  }

  // 🔍 DISPONIBILITÉ (votre code pro !)
  static async isSalleDisponible(idSalle, date, heureDebut, heureFin) {
    const overlapping = await Reservation.count({
      where: {
        id_salle: idSalle,
        date_reservation: date,
        [Op.or]: [
          sequelize.where(
            sequelize.fn('TIME', sequelize.col('heure_debut')),
            { [Op.lte]: heureFin }
          ),
          sequelize.where(
            sequelize.fn('TIME', sequelize.col('heure_fin')),
            { [Op.gte]: heureDebut }
          )
        ]
      }
    });
    return overlapping === 0;
  }
}

module.exports = SalleService;
