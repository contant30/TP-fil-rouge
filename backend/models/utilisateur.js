// models/Utilisateur.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {  // ← Reçoit sequelize depuis index.js
  const Utilisateur = sequelize.define('Utilisateur', {
    id_utilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
},
    nom_utilisateur: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { len: [3, 50] }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    mot_de_passe: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { len: [8, 255] }
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    }
  }, {
    tableName: 'utilisateurs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['email'] }]
  });

  return Utilisateur;  // ← Retourne le modèle
};
