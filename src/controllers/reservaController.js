const reservaService = require('../services/reservaService');

async function criar(req, res, next) {
  try {
    const reserva = await reservaService.criar(req.body, req.usuario);
    return res.status(201).json(reserva);
  } catch (erro) {
    next(erro);
  }
}

async function listarTodas(req, res, next) {
  try {
    const reservas = await reservaService.listarTodas();
    return res.status(200).json(reservas);
  } catch (erro) {
    next(erro);
  }
}

async function listarMinhas(req, res, next) {
  try {
    const reservas = await reservaService.listarMinhas(req.usuario);
    return res.status(200).json(reservas);
  } catch (erro) {
    next(erro);
  }
}

async function listarPorSala(req, res, next) {
  try {
    const reservas = await reservaService.listarDaSala(req.params.id);
    return res.status(200).json(reservas);
  } catch (erro) {
    next(erro);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const reserva = await reservaService.buscarPorId(req.params.id, req.usuario);
    return res.status(200).json(reserva);
  } catch (erro) {
    next(erro);
  }
}

async function atualizar(req, res, next) {
  try {
    const reserva = await reservaService.atualizar(req.params.id, req.body, req.usuario);
    return res.status(200).json(reserva);
  } catch (erro) {
    next(erro);
  }
}

async function excluir(req, res, next) {
  try {
    await reservaService.excluir(req.params.id, req.usuario);
    return res.status(204).send();
  } catch (erro) {
    next(erro);
  }
}

module.exports = {
  criar,
  listarTodas,
  listarMinhas,
  listarPorSala,
  buscarPorId,
  atualizar,
  excluir,
};