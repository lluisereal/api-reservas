function errorHandler(erro, req, res, next) {
  if (erro.statusCode) {
    return res.status(erro.statusCode).json({ erro: erro.message });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = errorHandler;