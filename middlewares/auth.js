const { Token, User, ResponseMaker } = require('../models');

class Auth {
  static getHeaderToken(bearer) {
    if (!bearer) {
      return '';
    }
    return bearer.split(' ')[1];
  }

  static async haveSession(req, res, next) {
    const hToken = Auth.getHeaderToken(req.headers.authorization);
    try {
      const token = await Token.get(hToken);
      if (token.length !== 0) {
        const validSession = await token.isActive();
        if (validSession) {
          req.session = {
            token,
            user: await User.get(token.userId),
          };
          return next();
        }
      }
      return next(ResponseMaker.forbidden('You need to be logged!'));
    } catch (err) {
      return next(err);
    }
  }

  static havePermission(req, res, next, permission) {
    const { user } = req.session;
    if (user.canDo(permission)) {
      const condition = user.permissions[permission];
      if (condition) {
        if (Auth[condition](req, user)) {
          return next();
        }
        return next(ResponseMaker.forbidden('You have no permission to do this!'));
      }
      return next();
    }
    return next(ResponseMaker.forbidden('You have not permission to do this!'));
  }

  static equalsId(req, user) {
    const userId = parseInt(req.params.userId, 10);
    return user.id === userId;
  }

  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      if (user.length !== 0) {
        return res.status(201)
          .send(ResponseMaker.created(Auth.type, user));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(Auth.type, user));
    } catch (err) {
      return next(err);
    }
  }

  static async login(req, res, next) {
    const { mail, password } = req.body;
    try {
      const user = await User.login(mail, password);
      if (user.length !== 0) {
        const activeToken = await Token.getActiveToken(user.id);
        if (activeToken.length !== 0) {
          return res.send(ResponseMaker.ok('Logged in!', Auth.type, activeToken));
        }
        const token = await Token.create({ userId: user.id, type: '1' });
        if (token.length !== 0) {
          return res.send(ResponseMaker.ok('Logged in!', Auth.type, token));
        }
      }
    } catch (err) {
      return next(err);
    }
    return res.status(409)
      .send(ResponseMaker.conflict(Auth.type, null, 'Invalid email or password!'));
  }

  static async logout(req, res, next) {
    try {
      await req.session.token.deactivate();
    } catch (err) {
      return next(err);
    }
    return next();
  }
}

Auth.type = 'auth';

module.exports = Auth;
