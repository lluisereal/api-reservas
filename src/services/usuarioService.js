const usuarioRepository = require('../repositories/usuarioRepository');
const reservaRepository = require('../repositories/reservaRepository');
const AppError = require('../utils/AppError');

async function listar() {
  return usuarioRepository.listar();
}

async function buscarPorId(id) {
  const usuario = await usuarioRepository.buscarPorIdSemSenha(id);
  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404);
  }
  return usuario;
}

async function listarReservas(id) {
  const usuario = await buscarPorId(id);
  return reservaRepository.listarPorUsuario(usuario.id);
}

module.exports = { listar, buscarPorId, listarReservas };