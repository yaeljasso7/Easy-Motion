const mdl = require('../models');

/**
 * Filter middleware
 * Checks for available filters in the model, and parses them
 */
class Filter {
  /**
   * @method validate - Parse the query attributes, and adds some default values
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Respose Object
   * @param  {Function} next - Represents the next middleware in the cycle.
   * @param  {String}   type - The model type, to check available filters
   */
  static validate(req, res, next, type) {
    req.query.filters = {};
    const mdlFilters = mdl[type].ValidFilters;
    const mdlFilterKeys = Object.keys(mdlFilters);
    const page = Number(req.query.page);
    req.query.page = isNaN(page) ? Filter.DefaultPage : page;
    const { sort, order } = req.query;
    if (mdlFilterKeys.includes(sort)) {
      req.query.sorter = sort;
      req.query.desc = (order && order.toLowerCase() === 'desc');
    }
    mdlFilterKeys.forEach((cond) => {
      if (req.query[cond] && req.query[cond].length !== 0) {
        const extraAction = mdlFilters[cond];
        req.query.filters[cond] = Filter[extraAction](req.query[cond]);
      }
    });
    next();
  }

  static asNumber(data) {
    return Number(data);
  }

  static asString(data) {
    return String(data);
  }
}

Filter.DefaultPage = Number(process.env.DEFAULT_PAGE);

module.exports = Filter;
