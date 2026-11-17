require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.sync();
    console.log('Banco de dados sincronizado.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error('Erro ao iniciar o servidor:', erro);
  }
}

iniciar();