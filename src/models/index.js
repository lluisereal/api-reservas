const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Sala = require('./Sala');
const Reserva = require('./Reserva');

// Um usuário tem várias reservas (1:N)
Usuario.hasMany(Reserva, {
  foreignKey: { name: 'usuarioId', allowNull: false },
  as: 'reservas',
  onDelete: 'RESTRICT',
});
Reserva.belongsTo(Usuario, {
  foreignKey: { name: 'usuarioId', allowNull: false },
  as: 'usuario',
});

// Uma sala tem várias reservas (1:N)
Sala.hasMany(Reserva, {
  foreignKey: { name: 'salaId', allowNull: false },
  as: 'reservas',
  onDelete: 'RESTRICT',
});
Reserva.belongsTo(Sala, {
  foreignKey: { name: 'salaId', allowNull: false },
  as: 'sala',
});

module.exports = { sequelize, Usuario, Sala, Reserva };