// models/index.js - ✅ ORDRE STRICT + VERIFS
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tp_fil_rouge',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  
  { host: 'localhost', dialect: 'mysql', logging: console.log }
  
);

// 1. CHARGE TOUS modèles AVANT associations
const Utilisateur = require('./utilisateur')(sequelize, DataTypes);
const Salle = require('./salle')(sequelize, DataTypes);
const Ressource = require('./ressource')(sequelize, DataTypes);
const Reservation = require('./reservation')(sequelize, DataTypes);

// ✅ VÉRIFs DEBUG (retirez après)
console.log('Utilisateur:', typeof Utilisateur); // function
console.log('Reservation:', typeof Reservation); // function



// 2. ASSOCIATIONS APRÈS TOUS chargés
Utilisateur.hasMany(Reservation, { foreignKey: 'id_utilisateur', as: 'reservations' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'id_utilisateur' });

Salle.hasMany(Reservation, { foreignKey: 'id_salle' });
Reservation.belongsTo(Salle, { foreignKey: 'id_salle' });

Ressource.belongsToMany(Reservation, { through: 'ReservationRessources' });
Reservation.belongsToMany(Ressource, { through: 'ReservationRessources' });


module.exports = { sequelize, Utilisateur, Salle, Ressource, Reservation };
