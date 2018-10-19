const bcrypt = require('bcryptjs');
const { User, Token, ResponseMaker } = require('../models');

class Auth {
  constructor() {
    this.salt = parseInt(process.env.SALT, 10);
    this.register = this.register.bind(this);
  }

  async register(req, res, next) {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password, this.salt);
      const user = await User.createUser({ ...req.body, password: hashedPassword });
      const createdAt = new Date();
      const expires = parseInt(process.env.SESSION_LIVES, 10);
      this.token = bcrypt.hashSync(`${user.id}${createdAt}`, this.salt);
      const data = await Token.create({
        token: this.token,
        type: 1,
        userId: user.id,
        createdAt,
        expires,
        active: 1,
      });
      return res.status(201)
        .send(ResponseMaker.created('token', data));
    } catch (err) {
      return next(err);
    }
  }

  login(req, res, next) {

  }

  logout(req, res, next) {

  }
}
// userCtrl = register > inserta un user en la db , lo recupera y crea un token con el idUser+fechaactual
// userCtrl = login > busca si existe el usuario con la contraseña > busca en tokens si ese usuario tiene
//            una secion activa > si no > crea el token con el idUser+fechaactual y lo regreas idUser+token, lo copias
// middleware auth = saber si el token si existe el token > si esta activo

module.exports = new Auth();
