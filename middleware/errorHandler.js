module.exports = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) return next(err);

  if (req.path.startsWith('/api')) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }

  res.status(500).send('Erro interno do servidor');
};
