const express = require('express');
const reservaRoutes = require('./routes/reservaRoutes');
const authRoutes = require('./routes/authRoutes');
const salaRoutes = require('./routes/salaRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ mensagem: 'API de Reservas funcionando!' });
});

app.use('/salas', salaRoutes);
app.use('/auth', authRoutes);
app.use('/reservas', reservaRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(errorHandler);

module.exports = app;