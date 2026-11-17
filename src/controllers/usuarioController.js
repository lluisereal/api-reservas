const usuarioService = require('../services/usuarioService');

async function listar(req, res, next) {
  try {
    const usuarios = await usuarioService.listar();
    return res.status(200).json(usuarios);
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const usuario = await usuarioService.buscarPorId(req.params.id);
    return res.status(200).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

async function listarReservas(req, res, next) {
  try {
    const reservas = await usuarioService.listarReservas(req.params.id);
    return res.status(200).json(reservas);
  } catch (erro) {
    next(erro);
  }
}

async function excluir(req, res, next) {
  try {
    await usuarioService.excluir(req.params.id, req.usuario);
    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, buscarPorId, listarReservas, excluir };