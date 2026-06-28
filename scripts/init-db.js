require('dotenv').config();

const userModel = require('../models/userModel');
const settingsModel = require('../models/settingsModel');

async function init() {
  settingsModel.ensureDefaults();
  const admin = await userModel.ensureDefaultAdmin();

  if (admin) {
    console.log(`Banco inicializado. Usuário criado: ${admin.username} / ${admin.password}`);
  } else {
    console.log('Banco inicializado. Já existem usuários cadastrados.');
  }
}

init().catch((error) => {
  console.error('Erro ao inicializar banco:', error);
  process.exit(1);
});
