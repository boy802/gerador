require('dotenv').config();

const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const rateLimit = require('./middleware/rateLimit');
const userModel = require('./models/userModel');

const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const batchRoutes = require('./routes/batchRoutes');
const historyRoutes = require('./routes/historyRoutes');
const apiRoutes = require('./routes/apiRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
app.set('trust proxy', 1);
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'dev_secret_change_me';

if (isProduction && !process.env.SESSION_SECRET) {
  console.warn('AVISO: defina SESSION_SECRET no ambiente de produção.');
}

app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(compression());
app.use(rateLimit);

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  if (req.query && req.query._method) {
    req.method = String(req.query._method).toUpperCase();
  }
  next();
});

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', authRoutes);
app.use('/codes', codeRoutes);
app.use('/batches', batchRoutes);
app.use('/history', historyRoutes);
app.use('/api', apiRoutes);
app.use('/settings', settingsRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

app.use(require('./middleware/errorHandler'));

async function start() {
  const defaultAdmin = await userModel.ensureDefaultAdmin();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    if (defaultAdmin) {
      console.log(`Usuário inicial criado: ${defaultAdmin.username} / ${defaultAdmin.password}`);
      console.log('Altere essa senha depois do primeiro acesso.');
    }
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar servidor:', error);
  process.exit(1);
});
