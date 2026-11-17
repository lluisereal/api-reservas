const { Op } = require('sequelize');
const { Reserva, Sala, Usuario } = require('../models');

const ORDEM = [['data', 'ASC'], ['horaInicio', 'ASC']];

const incluirSalaEUsuario = [
  { model: Sala, as: 'sala' },
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
];

async function listarTodas() {
  return Reserva.findAll({ include: incluirSalaEUsuario, order: ORDEM });
}

async function listarPorUsuario(usuarioId) {
  return Reserva.findAll({
    where: { usuarioId },
    include: [{ model: Sala, as: 'sala' }],
    order: ORDEM,
  });
}

async function listarPorSala(salaId) {
  return Reserva.findAll({
    where: { salaId },
    include: [{ model: Usuario, as: 'usuario', attributes: ['nome'] }],
    order: ORDEM,
  });
}

async function buscarPorId(id) {
  return Reserva.findByPk(id, { include: incluirSalaEUsuario });
}

async function buscarConflito(salaId, data, horaInicio, horaFim, ignorarId) {
  const where = {
    salaId,
    data,
    horaInicio: { [Op.lt]: horaFim },
    horaFim: { [Op.gt]: horaInicio },
  };

  if (ignorarId) {
    where.id = { [Op.ne]: ignorarId };
  }

  return Reserva.findOne({ where });
}

async function criar(dados) {
  return Reserva.create(dados);
}

async function atualizar(reserva, dados) {
  return reserva.update(dados);
}

async function excluir(reserva) {
  return reserva.destroy();
}

module.exports = {
  listarTodas,
  listarPorUsuario,
  listarPorSala,
  buscarPorId,
  buscarConflito,
  criar,
  atualizar,
  excluir,
};