const { Usuario } = require('../models');

async function buscarPorEmail(email) {
  return Usuario.findOne({ where: { email } });
}

async function buscarPorId(id) {
  return Usuario.findByPk(id);
}

async function criar(dados) {
  return Usuario.create(dados);
}

module.exports = { buscarPorEmail, buscarPorId, criar };