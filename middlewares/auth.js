const bcrypt = require('bcrypt');
const { User, Token } = require('../models');

class Auth {
  constructor() {
    this.register = this.register.bind(this);
  }

  static async register(req, res, next) {
    this.void();
    const user = await User.createUser(req.body);
    const token = bcrypt.hash('untoken', process.env.SECRET);
    const created = new Date();
    const expires = created + process.env.SESSION_LIVES;
    Token.create({
      token,
      user_id: user.id,
      type: 's',
      created_at: created,
      expires,
      active: 1,
    });
    next();
  }
  static login(req, res, next) {}
  static logout(req, res, next) {}
}

module.exports = Auth;
