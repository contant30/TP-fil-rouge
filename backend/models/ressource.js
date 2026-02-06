// models/Ressource.js - ✅ FACTORY (pas d'import index)
const { DataTypes } = require('sequelize');

// ❌ SUPPRIMEZ : const sequelize = require('./index').sequelize;

module.exports = (sequelize) => {
  const Ressource = sequelize.define('Ressource', {
    id_ressource: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom_ressource: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    quantite: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 0 }
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'ressources',
    timestamps: true
  });

  Ressource.prototype.estDisponible = function(quantiteDemandee = 1) {
    return this.quantite >= quantiteDemandee;
  };

  return Ressource;  // ✅ CRITIQUE
};
