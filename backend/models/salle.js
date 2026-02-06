// models/Salle.js - ✅ FIXED
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Salle = sequelize.define('Salle', {
    id_salle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_salle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    capacite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 500 }
    },
    localisation: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    tableName: 'salles',
    timestamps: true
  });

  // Méthode sans circular import (utilise include dans contrôleurs)
  Salle.prototype.estDisponible = async function(date, heureDebut, heureFin) {
    // ⚠️ PAS require('./Reservation') ici - circular !
    // Utilisez dans contrôleurs avec include
    console.log(`Salle ${this.nom_salle} check ${date} ${heureDebut}-${heureFin}`);
    return true; // Stub - implémentez via contrôleur
  };

  return Salle;  // ✅ CRITIQUE - Retourne le modèle
};
