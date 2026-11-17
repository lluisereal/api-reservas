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

async function excluir(id, usuarioLogado) {
  const usuario = await buscarPorId(id);

  if (usuario.id === usuarioLogado.id) {
    throw new AppError('Você não pode excluir o próprio usuário', 409);
  }

  const totalReservas = await usuarioRepository.contarReservas(usuario.id);
  if (totalReservas > 0) {
    throw new AppError('Não é possível excluir um usuário que possui reservas', 409);
  }

  await usuarioRepository.excluir(usuario);
}

module.exports = { listar, buscarPorId, listarReservas, excluir };