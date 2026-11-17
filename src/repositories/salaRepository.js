const { Sala, Reserva } = require('../models');

async function listar() {
  return Sala.findAll();
}

async function buscarPorId(id) {
  return Sala.findByPk(id);
}

async function buscarPorNome(nome) {
  return Sala.findOne({ where: { nome } });
}

async function criar(dados) {
  return Sala.create(dados);
}

async function atualizar(sala, dados) {
  return sala.update(dados);
}

async function excluir(sala) {
  return sala.destroy();
}

async function contarReservas(salaId) {
  return Reserva.count({ where: { salaId } });
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorNome,
  criar,
  atualizar,
  excluir,
  contarReservas,
};