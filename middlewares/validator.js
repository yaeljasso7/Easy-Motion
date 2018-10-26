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
    return !data.length || ['asc', 'desc'].includes(data.toLowerCase());
  }

  static word(data) {
    return (Validator.regex.word.test(data)) || !data.length;
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
    return (weight > 0 && weight < 400) || Number.isNaN(weight);
  }

  static isHeight(data) {
    const height = Number(data);
    return (height > 0 && height < 250) || Number.isNaN(height);
  }

  static required(data) {
    return data !== undefined && data !== null && data.length;
  }

  static email(data) {
    return (Validator.regex.email.test(data));
  }

  static validate(req, res, next, rules) {
    const error = {
      message: 'Validation Error',
      status: 409,
      details: {},
    };

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
