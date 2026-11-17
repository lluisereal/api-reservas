const { Usuario } = require('../models');

const SEM_SENHA = { exclude: ['senha'] };

async function buscarPorEmail(email) {
  return Usuario.findOne({ where: { email } });
}

async function buscarPorId(id) {
  return Usuario.findByPk(id);
}

async function criar(dados) {
  return Usuario.create(dados);
}

async function listar() {
  return Usuario.findAll({ attributes: SEM_SENHA, order: [['id', 'ASC']] });
}

async function buscarPorIdSemSenha(id) {
  return Usuario.findByPk(id, { attributes: SEM_SENHA });
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  criar,
  listar,
  buscarPorIdSemSenha,
};