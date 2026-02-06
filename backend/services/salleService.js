// services/salleService.js
const { Salle, Reservation } = require('../models');
const { Op } = require('sequelize');

class SalleService {
  static async getAllSalles() {
    return await Salle.findAll();
  }

  static async getSalleById(id) {
    const salle = await Salle.findByPk(id);
    if (!salle) throw new Error('SALLE_NOT_FOUND');
    return salle;
  }

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
