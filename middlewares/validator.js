const { ResponseMaker } = require('../models');

class Validator {
  static get regex() {
    return {
      word: /[a-zA-ZñÑ ]{3,}/,
      number: /^([0-9])*$/,
      email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      date: /^\d{4}-\d{2}-{2}$/,
    };
  }

  static order(data) {
    return !data || ['asc', 'desc'].includes(data.toLowerCase());
  }

  static word(data) {
    return !data || (Validator.regex.word.test(data));
  }

  static optionalDate(data) {
    return (!data.length || Validator.regex.date.test(data));
  }

  static number(data) { // valida que sea solo numeros
    return (Validator.regex.number.test(data));
  }

  static iscellphone(data) {
    return data.length === 10 || data.length === 0;
  }

  static isWeight(data) {
    const weight = Number(data);
    return (weight > 0 && weight < 400) || Number.isNaN(weight) || data.length === 0;
  }

  static isHeight(data) {
    const height = Number(data);
    return (height > 0 && height < 250) || Number.isNaN(height) || data.length === 0;
  }

  static required(data) {
    return data !== undefined && data !== null && data.length;
  }

  static email(data) {
    return (Validator.regex.email.test(data)) || data.length === 0;
  }

  static matchPassword(req, res, next) {
    if (req.body.password === req.body.rePassword) {
      return next();
    }
    return next(ResponseMaker.conflict({ msg: 'Passwords does not match!' }));
  }

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
