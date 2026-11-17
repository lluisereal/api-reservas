const salaRepository = require('../repositories/salaRepository');
const AppError = require('../utils/AppError');

function validarCampos({ nome, capacidade }, obrigatorios) {
  if (obrigatorios || nome !== undefined) {
    if (typeof nome !== 'string' || nome.trim() === '') {
      throw new AppError('O nome da sala é obrigatório', 400);
    }
  }
  if (obrigatorios || capacidade !== undefined) {
    if (!Number.isInteger(capacidade) || capacidade <= 0) {
      throw new AppError('A capacidade deve ser um número inteiro maior que zero', 400);
    }
  }
}

async function listar() {
  return salaRepository.listar();
}

async function buscarPorId(id) {
  const sala = await salaRepository.buscarPorId(id);
  if (!sala) {
    throw new AppError('Sala inexistente', 404);
  }
  return sala;
}

async function criar(dados) {
  validarCampos(dados, true);

  const nomeJaExiste = await salaRepository.buscarPorNome(dados.nome.trim());
  if (nomeJaExiste) {
    throw new AppError('Já existe uma sala com esse nome', 409);
  }

  return salaRepository.criar({
    nome: dados.nome.trim(),
    capacidade: dados.capacidade,
    descricao: dados.descricao,
  });
}

async function atualizar(id, dados) {
  const sala = await buscarPorId(id);
  validarCampos(dados, false);

  if (dados.nome !== undefined) {
    const existente = await salaRepository.buscarPorNome(dados.nome.trim());
    if (existente && existente.id !== sala.id) {
      throw new AppError('Já existe uma sala com esse nome', 409);
    }
  }

  return salaRepository.atualizar(sala, {
    nome: dados.nome !== undefined ? dados.nome.trim() : undefined,
    capacidade: dados.capacidade,
    descricao: dados.descricao,
  });
}

async function excluir(id) {
  const sala = await buscarPorId(id);

  const totalReservas = await salaRepository.contarReservas(sala.id);
  if (totalReservas > 0) {
    throw new AppError('Não é possível excluir uma sala que possui reservas', 409);
  }

  await salaRepository.excluir(sala);
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };