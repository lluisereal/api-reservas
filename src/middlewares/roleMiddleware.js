const AppError = require('../utils/AppError');

function autorizar(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      return next(new AppError('Acesso proibido para o seu perfil', 403));
    }
    next();
  };
}

module.exports = autorizar;