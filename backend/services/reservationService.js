// services/reservationService.js
const { Reservation, Salle, Utilisateur, Ressource } = require('../models');
const { Op, sequelize } = require('sequelize');

class ReservationService {
  static async createReservation(userId, data) {
    const { date_reservation, heure_debut, heure_fin, id_salle, ressources = [] } = data;

    // 1. Vérif salle disponible
    const isAvailable = await SalleService.isSalleDisponible(id_salle, date_reservation, heure_debut, heure_fin);
    if (!isAvailable) throw new Error('SALLE_NOT_AVAILABLE');

    // 2. Vérif ressources
    for (const idRessource of ressources) {
      const available = await RessourceService.isRessourceDisponible(idRessource, 1);
      if (!available) throw new Error(`RESSOURCE_NOT_AVAILABLE: ${idRessource}`);
    }

    // 3. Créer réservation
    const reservation = await Reservation.create({
      date_reservation,
      heure_debut,
      heure_fin,
      status: 'pending',
      id_utilisateur: userId,
      id_salle
    });

    // 4. Associer ressources
    if (ressources.length) {
      await reservation.setRessources(ressources);
    }

    return reservation;
  }

  static async getReservationsByUser(userId) {
    return await Reservation.findAll({
      where: { id_utilisateur: userId },
      include: [Utilisateur, Salle, Ressource],
      order: [['date_reservation', 'DESC']]
    });
  }

  static async validerReservation(id) {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) throw new Error('RESERVATION_NOT_FOUND');
    await reservation.validerReservation();
    return reservation;
  }
}

module.exports = ReservationService;
