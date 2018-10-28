function errorHandler(err, req, res, next) {
  console.error('Error handler');
  return res.status(err.status || 500).send(err);
}

module.exports = errorHandler;
