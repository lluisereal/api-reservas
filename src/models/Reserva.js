const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaInicio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horaFim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Reserva;