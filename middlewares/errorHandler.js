/**
 * @function errorHandler - Catch & handle errors
 *
 * @param  {Object}   err  - The error object
 * @param  {Object}   req  - The Request Object
 * @param  {Object}   res  - The Respose Object
 * @param  {Function} next - Represents the next middleware in the cycle.
 * @return {Object}        - json error message
 */
function errorHandler(err, req, res, next) {
  console.error('Error handler', err);
  return res.status(err.status || 500).send(err);
}

module.exports = errorHandler;
