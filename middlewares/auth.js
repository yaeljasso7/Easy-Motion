const bcrypt = require('bcrypt');
const { User, Token } = require('../models');

class Auth {
  constructor() {
    this.register = this.register.bind(this);
  }

  static async register(req, res, next) {
    try {
      const user = await User.createUser(req.body);
      // const user = { id: 5, name: 'user5' };
      const createdAt = new Date();
      const expires = createdAt + parseInt(process.env.SESSION_LIVES);
      const saltRounds = parseInt(process.env.SECRET);
      const token = await bcrypt.hash( `${user.name}${createdAt}`, saltRounds);
      const data = await Token.create({
        token,
        type: 1,
        userId: user.id,
        createdAt,
        expires,
        active: 1
      });
      res.status(201).send({ data: token });
    } catch (err) {
      return next(err);
    }
  }

  static login(req, res, next) {}
  static logout(req, res, next) {}
}
// userCtrl = register > inserta un user en la db , lo recupera y crea un token con el idUser+fechaactual
// userCtrl = login > busca si existe el usuario con la contraseña > busca en tokens si ese usuario tiene
//            una secion activa > si no > crea el token con el idUser+fechaactual y lo regreas idUser+token, lo copias
// middleware auth = saber si el token si existe el token > si esta activo

module.exports = Auth;
