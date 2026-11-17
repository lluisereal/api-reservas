const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho || !cabecalho.startsWith('Bearer ')) {
    return next(new AppError('Token não informado', 401));
  }

  const token = cabecalho.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id, perfil: payload.perfil };
    next();
  } catch (erro) {
    next(new AppError('Token inválido ou expirado', 401));
  }
}

module.exports = autenticar;