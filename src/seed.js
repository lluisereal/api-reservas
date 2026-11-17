require('dotenv').config();

const bcrypt = require('bcryptjs');
const { sequelize, Usuario } = require('./models');

async function criarAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_SENHA;

    if (!email || !senha) {
      console.error('Defina ADMIN_EMAIL e ADMIN_SENHA no arquivo .env');
      return;
    }

    await sequelize.sync();

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      console.log('O administrador já existe.');
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await Usuario.create({
      nome: 'Administrador',
      email: email.toLowerCase(),
      senha: senhaHash,
      perfil: 'ADMIN',
    });

    console.log('Administrador criado com sucesso.');
  } catch (erro) {
    console.error('Erro ao criar administrador:', erro);
  } finally {
    await sequelize.close();
  }
}

criarAdmin();