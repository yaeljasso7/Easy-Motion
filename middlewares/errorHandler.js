function errorHandler(err, req, res) {
  console.error('Error handler', typeof err, err);
  return res.status(err.status || 500).send(err);
}

module.exports = errorHandler;
