const reservaRepository = require('../repositories/reservaRepository');
const salaRepository = require('../repositories/salaRepository');
const AppError = require('../utils/AppError');

const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

function dataValida(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }
  const [ano, mes, dia] = data.split('-').map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    d.getUTCFullYear() === ano &&
    d.getUTCMonth() === mes - 1 &&
    d.getUTCDate() === dia
  );
}

function validarReserva({ salaId, data, horaInicio, horaFim }) {
  if (!Number.isInteger(salaId) || salaId <= 0) {
    throw new AppError('salaId deve ser um número inteiro válido', 400);
  }
  if (!dataValida(data)) {
    throw new AppError('A data deve ser válida e estar no formato AAAA-MM-DD', 400);
  }
  if (!REGEX_HORA.test(horaInicio) || !REGEX_HORA.test(horaFim)) {
    throw new AppError('As horas devem estar no formato HH:MM (ex.: 19:00)', 400);
  }
  // Regra de negócio 2
  if (horaFim <= horaInicio) {
    throw new AppError('A hora de término deve ser maior que a hora de início', 400);
  }
}

async function verificarSala(salaId) {
  const sala = await salaRepository.buscarPorId(salaId);
  if (!sala) {
    throw new AppError('Sala não encontrada', 404);
  }
}

// Regra de negócio 1
async function verificarConflito({ salaId, data, horaInicio, horaFim }, ignorarId) {
  const conflito = await reservaRepository.buscarConflito(
    salaId, data, horaInicio, horaFim, ignorarId
  );
  if (conflito) {
    throw new AppError('A sala já está reservada nesse horário', 409);
  }
}

async function buscarComPermissao(id, usuario) {
  const reserva = await reservaRepository.buscarPorId(id);
  if (!reserva) {
    throw new AppError('Reserva não encontrada', 404);
  }
  if (usuario.perfil !== 'ADMIN' && reserva.usuarioId !== usuario.id) {
    throw new AppError('Você não tem permissão para acessar esta reserva', 403);
  }
  return reserva;
}

async function criar(dados = {}, usuario) {
  const { salaId, data, horaInicio, horaFim } = dados;
  const novos = { salaId, data, horaInicio, horaFim };

  validarReserva(novos);
  await verificarSala(salaId);
  await verificarConflito(novos);

  const reserva = await reservaRepository.criar({
    ...novos,
    usuarioId: usuario.id,
  });

  return reservaRepository.buscarPorId(reserva.id);
}

async function listarTodas() {
  return reservaRepository.listarTodas();
}

async function listarMinhas(usuario) {
  return reservaRepository.listarPorUsuario(usuario.id);
}

async function listarDaSala(salaId) {
  await verificarSala(salaId);
  return reservaRepository.listarPorSala(salaId);
}

async function buscarPorId(id, usuario) {
  return buscarComPermissao(id, usuario);
}

async function atualizar(id, dados = {}, usuario) {
  const reserva = await buscarComPermissao(id, usuario);

  const novos = {
    salaId: dados.salaId !== undefined ? dados.salaId : reserva.salaId,
    data: dados.data !== undefined ? dados.data : reserva.data,
    horaInicio: dados.horaInicio !== undefined ? dados.horaInicio : reserva.horaInicio,
    horaFim: dados.horaFim !== undefined ? dados.horaFim : reserva.horaFim,
  };

  validarReserva(novos);
  await verificarSala(novos.salaId);
  await verificarConflito(novos, reserva.id);

  await reservaRepository.atualizar(reserva, novos);
  return reservaRepository.buscarPorId(reserva.id);
}

async function excluir(id, usuario) {
  const reserva = await buscarComPermissao(id, usuario);
  await reservaRepository.excluir(reserva);
}

module.exports = {
  criar,
  listarTodas,
  listarMinhas,
  listarDaSala,
  buscarPorId,
  atualizar,
  excluir,
};