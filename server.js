require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('./middleware/rateLimit');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const batchRoutes = require('./routes/batchRoutes');
const historyRoutes = require('./routes/historyRoutes');
const apiRoutes = require('./routes/apiRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// Segurança e performance
app.use(helmet());
app.use(compression());
app.use(rateLimit);

// Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/', authRoutes);
app.use('/codes', codeRoutes);
app.use('/batches', batchRoutes);
app.use('/history', historyRoutes);
app.use('/api', apiRoutes);
app.use('/settings', settingsRoutes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Erros
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
