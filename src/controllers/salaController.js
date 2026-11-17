const salaService = require('../services/salaService');

async function listar(req, res, next) {
  try {
    const salas = await salaService.listar();
    return res.status(200).json(salas);
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const sala = await salaService.buscarPorId(req.params.id);
    return res.status(200).json(sala);
  } catch (erro) {
    next(erro);
  }
}

async function criar(req, res, next) {
  try {
    const sala = await salaService.criar(req.body);
    return res.status(201).json(sala);
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(req, res, next) {
  try {
    const sala = await salaService.atualizar(req.params.id, req.body);
    return res.status(200).json(sala);
  } catch (erro) {
    next(erro);
  }
}

async function excluir(req, res, next) {
  try {
    await salaService.excluir(req.params.id);
    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };