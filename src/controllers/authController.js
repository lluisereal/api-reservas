const authService = require('../services/authService');

async function registrar(req, res, next) {
  try {
    const usuario = await authService.registrar(req.body);
    return res.status(201).json(usuario);
  } catch (erro) {
    next(erro);
  }
}

async function login(req, res, next) {
  try {
    const resultado = await authService.login(req.body);
    return res.status(200).json(resultado);
  } catch (erro) {
    next(erro);
  }
}

module.exports = { registrar, login };