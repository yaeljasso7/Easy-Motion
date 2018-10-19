const db = require('../db');
const { User, Token } = require('../models');

class AuthCtrl {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  // registra a un usuario a la db
  async register(req, res, next) {
    try {
      const data = await User.createUser(req.body);
      res.status(201).send(data);
      const data2 = await User.addProgress(data.id, data.weight, data.height); //insertar primer progreso
    } catch (err) {
      next(err);
    }
  }

  // login > busca si existe el usuario con la contraseña > busca en tokens si ese usuario tiene
  // una secion activa > si no > crea el token con el idUser+fechaactual
  // y lo regreas idUser+token, lo copias
  async login (req, res, next) {
    const { mail, password } = req.body;
    try {
      const data = await User.loginUser( mail, pasasword );
      if (data.length === 0) {
        // el user no existe o la pass es incorrecta
      }
      // creamos el token
      const token = await Token.create( data.id, '1' );
      res.status(201).send(token);
    } catch (err) {
      next(err);
    }


    res.status(201).send(data);
  }
}
module.exports = new AuthCtrl();
