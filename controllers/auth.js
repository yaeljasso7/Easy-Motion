const { User, Token, ResponseMaker } = require('../models');

class AuthCtrl {
  constructor() {
    this.addToken = this.addToken.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.type = 'auth';
  }

  async addToken(req, res) {
    this.addToken = 'addToken';
    // 1- revisar que exista el user
    const { mail, password } = req.body;
    const data = await User.loginUser(mail);
    // no se encontro user o contraseña erronea
    if (data.length === 0) {
      return res.send('redirigiendo a vuelve a intentarlo');
    }

    const check = await Token.checkPassword(password, data.password);
    // console.log('check: ', check);
    // si la constraseña no es valida
    if (!check) {
      return res.status(409)
        .send(ResponseMaker.conflict(this.type));
    }
    try {
      const userId = data.id;
      const type = '1';
      req.body = { userId, type };
      console.log(req.body);
      const token = await Token.createToken(req.body);
      return res.send(token);
    } catch (e) {
      console.log(e);
    }
    return res.send('token');
  }

  async registerUser(req, res, next) {
    req.body.password = await Token.hashPassword(req.body.password);
    try {
      const user = await User.create(req.body);
      if (user.length !== 0) {
        return res.status(201)
          .send(ResponseMaker.created(this.type, user));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, user));
    } catch (err) {
      // res.status(409).send(`Insert error: ${e.duplicated.message}`);
      return next(err);
    }
  }
}

module.exports = new AuthCtrl();
