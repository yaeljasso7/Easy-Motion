const mdl = require('../models');

/**
 * Filter middleware
 * Checks for available filters in the model, and parses them
 */
class Filter {
  /**
   * @method validate - Parse the query attributes, adding some default values
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
    req.query.page = !page ? Filter.DefaultPage : page;

    const { sort, order } = req.query;
    req.query.sorter = mdlFilterKeys.includes(sort) ? sort : undefined;
    req.query.desc = (order && order.toLowerCase() === 'desc');

    mdlFilterKeys.forEach((cond) => {
      if (req.query[cond] && req.query[cond].length !== 0) {
        const extraAction = mdlFilters[cond];
        const { op, key, data } = Filter[extraAction](cond, req.query[cond]);
        if (op) {
          if (!req.query.filters[op]) {
            req.query.filters[op] = {};
          }
          req.query.filters[op][key] = data;
        } else {
          req.query.filters[key] = data;
        }
      }
    });
    next();
  }

  static asNumber(key, data) {
    return { key, data: Number(data) };
  }

  static asString(key, data) {
    return { op: 'like', key, data: `%${data}%` };
  }
}

Filter.DefaultPage = Number(process.env.DEFAULT_PAGE);

module.exports = Filter;
