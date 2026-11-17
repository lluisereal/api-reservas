const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuarioRepository');
const AppError = require('../utils/AppError');

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function semSenha(usuario) {
  const dados = usuario.toJSON();
  delete dados.senha;
  return dados;
}

async function registrar(dados = {}) {
  const { nome, email, senha } = dados;

  if (typeof nome !== 'string' || nome.trim() === '') {
    throw new AppError('O nome é obrigatório', 400);
  }
  if (typeof email !== 'string' || !REGEX_EMAIL.test(email.trim())) {
    throw new AppError('Informe um email válido', 400);
  }
  if (typeof senha !== 'string' || senha.length < 6) {
    throw new AppError('A senha deve ter no mínimo 6 caracteres', 400);
  }

  const emailNormalizado = email.trim().toLowerCase();

  const existente = await usuarioRepository.buscarPorEmail(emailNormalizado);
  if (existente) {
    throw new AppError('Já existe um usuário com esse email', 409);
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await usuarioRepository.criar({
    nome: nome.trim(),
    email: emailNormalizado,
    senha: senhaHash,
    perfil: 'USER',
  });

  return semSenha(usuario);
}

async function login(dados = {}) {
  const { email, senha } = dados;

  if (typeof email !== 'string' || typeof senha !== 'string') {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  const usuario = await usuarioRepository.buscarPorEmail(email.trim().toLowerCase());
  if (!usuario) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    throw new AppError('Email ou senha inválidos', 401);
  }

  const token = jwt.sign(
    { id: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, usuario: semSenha(usuario) };
}

module.exports = { registrar, login };