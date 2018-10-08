class Validator {
  static get regex() {
    return {
      word: /[a-zA-ZñÑ ]{3,}/,
      number: /^([0-9])*$/,
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    };
  }

  static word(data) {
    return (Validator.regex.word.test(data));
  }

  static number(data) { //valida que sea solo numeros
    return (Validator.regex.number.test(data));
  }

  static iscellphone(data){
    return data.length == 10 || data.length == 0; // ==0 por si el usuario no envia el mobile
  }

  static isWeight(data){
    data = parseInt(data);
    return (data > 0 && data < 400) || isNaN(data); //isNaN por si no envia el usuario el Weight
  }

  static isHeight(data){
    data = parseInt(data);
    return (data > 0 && data < 250) || isNaN(data); //isNaN por si no envia el usuario el Height
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

    for (let part in rules) { //part = body
      for (let field in rules[part]) { //field = name,mail,mobile
        let validators = rules[part][field].split(','); //rules[part][field] = 'email,required'
        validators.forEach((f) => {
          if (!Validator[f](req[part][field] || '')) {
            if (Array.isArray(error.details[field])) {
              error.details[field].push(`The field ${field} should be a valid ${f}`);
            } else {
              error.details[field] = [`The field ${field} should be a valid ${f}`];
            }
          }
        });
      }
    }
    Object.keys(error.details).length ? next(error) : next(); //si hay erores next(error) si no next()
  }
}

module.exports = Validator;
