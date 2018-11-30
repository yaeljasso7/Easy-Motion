const { ResponseMaker } = require('../models');

/**
 * @class Validator
 * Check if the inputs are valid
 */
class Validator {
  /**
   * RegExp for some fieldd validations: word, number, email & date
   * @type {Object}
   */
  static get regex() {
    return {
      word: /[a-zA-ZñÑ ]{3,}/,
      number: /^([0-9])*$/,
      email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      date: /^\d{4}-\d{2}-\d{2}$/,
    };
  }

  /**
   * Order validator
   * @param  {String} data - Data to be matched as valid order (asc or desc)
   * @return {Boolean} - data validation
   */
  static order(data) {
    return !data || ['asc', 'desc'].includes(data.toLowerCase());
  }

  /**
   * Word validator
   * @param  {String} data - Data to be matched as valid word
   * @return {Boolean} - data validation
   */
  static word(data) {
    return !data || Validator.regex.word.test(data);
  }

  /**
   * Date validator
   * @param  {String} data - Data to be matched as valid date
   * @return {Boolean} - data validation
   */
  static date(data) {
    return !data || Validator.regex.date.test(data);
  }

  /**
   * Number validator
   * @param  {String} data - Data to be matched as valid number
   * @return {Boolean} - data validation
   */
  static number(data) { // valida que sea solo numeros
    return (Validator.regex.number.test(data));
  }

  /**
   * Cellphone validato             r
   * @param  {String} data - Data to be matched as valid phone
   * @return {Boolean} - data validation
   */
  static iscellphone(data) {
    return !data || data.length === 10;
  }

  /**
   * Weight validator
   * @param  {String} data - Data to be matched as valid weight
   * @return {Boolean} - data validation
   */
  static isWeight(data) {
    const weight = Number(data);
    return !data || (weight > 0 && weight < 400);
  }

  /**
   * Height validator
   * @param  {String} data - Data to be matched as valid height
   * @return {Boolean} - data validation
   */
  static isHeight(data) {
    const height = Number(data);
<<<<<<< HEAD
    return !data || (height > 0 && height < 250);
=======
    return (height > 0 && height < 250) || data.length === 0;
>>>>>>> 0de7ba33a11a587a1acdc885418478d6fcc18488
  }

  /**
   * Required validator
   * @param  {String} data - Data to be matched as valid required
   * @return {Boolean} - data validation
   */
  static required(data) {
    return data !== undefined && data !== null && data.length;
  }

  /**
   * Email validator
   * @param  {String} data - Data to be matched as valid email
   * @return {Boolean} - data validation
   */
  static email(data) {
<<<<<<< HEAD
    return !data || (Validator.regex.email.test(data));
=======
    return (Validator.regex.email.test(data)) || data.length === 0;
>>>>>>> 0de7ba33a11a587a1acdc885418478d6fcc18488
  }

  static matchPassword(req, res, next) {
    if (req.body.password === req.body.rePassword) {
      return next();
    }
    return next(ResponseMaker.conflict({ msg: 'Passwords does not match!' }));
  }

  /**
   * @method validate - Checks whether the inputs are valid, using a set of rules
   *
   * @param  {Object}   req   - The Request Object
   * @param  {Object}   res   - The Respose Object
   * @param  {Function} next  - Represents the next middleware in the cycle.
   * @param  {Object}   rules - The rules to be applied to the input fields
   */
  static validate(req, res, next, rules) {
    const error = ResponseMaker.conflict({ msg: 'Validation Error!' });
    error.details = {};

    Object.keys(rules).forEach((part) => { // part = body
      Object.keys(rules[part]).forEach((field) => { // field = name,mail,mobile
        const validators = rules[part][field].split(','); // rules[part][field] = 'email,required'
        validators.forEach((f) => {
          if (!Validator[f](req[part][field] || '')) {
            if (Array.isArray(error.details[field])) {
              error.details[field].push(`The field ${field} should be a valid ${f}`);
            } else {
              error.details[field] = [`The field ${field} should be a valid ${f}`];
            }
          }
        });
      });
    });
    return Object.keys(error.details).length ? next(error) : next();
  }
}

module.exports = Validator;
