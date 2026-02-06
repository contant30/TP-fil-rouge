// models/Reservation.js - ✅ FACTORY COMPLETE
const { DataTypes } = require('sequelize');

// ❌ SUPPRIMEZ LIGNES 3 ET 33
// const sequelize = require('./index').sequelize;  
// Reservation.belongsToMany(require('./ressource'), ...

module.exports = (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    id_reservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date_reservation: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    heure_debut: {
      type: DataTypes.TIME,
      allowNull: false
    },
    heure_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'utilisateurs', key: 'id_utilisateur' }
    },
    id_salle: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'salles', key: 'id_salle' }
    }
  }, {
    tableName: 'reservations',
    timestamps: true
  });

  Reservation.prototype.validerReservation = async function() {
    this.status = 'confirmed';
    await this.save();
  };

  Reservation.prototype.annulerReservation = async function() {
    this.status = 'cancelled';
    await this.save();
  };

  return Reservation;  // ✅ CRITIQUE
};
