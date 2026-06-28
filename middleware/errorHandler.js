module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor');
};
