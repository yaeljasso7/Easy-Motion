const { Token, User, ResponseMaker } = require('../models');
const { mailer, MailMaker } = require('../mail');

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
      if (token.token) {
        const validSession = await token.isActive();
        if (validSession) {
          req.session = {
            token,
            user: await User.get(token.userId),
          };
          return next();
        }
      }
    } catch (err) {
      return next(err);
    }
    return next(ResponseMaker.forbidden('You need to be logged!'));
  }

  static havePermission(req, res, next, permission) {
    const { user } = req.session;
    if (user.canDo(permission)) {
      const condition = user.permissions[permission];
      if (condition) {
        if (Auth[condition](req, user)) {
          return next();
        }
        // return next(ResponseMaker.forbidden('You have no permission to do this!'));
      } else {
        return next();
      }
    }
    return next(ResponseMaker.forbidden('You have no permission to do this!'));
  }

  static equalsId(req, user) {
    const userId = Number(req.params.userId);
    return user.id === userId;
  }

  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      if (user.length !== 0) {
        Auth.sendMsg(user, Auth.confirmMsg);
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
    let token;
    try {
      const user = await User.login(mail, password);
      if (user.length !== 0) {
        token = await Token.getValidToken(user.id, Token.session);
        if (!token.token) {
          return res.send(ResponseMaker.conflict('Token', mail));
        }
        return res.send(ResponseMaker.ok('Logged in!', Auth.type, token));
      }
    } catch (err) {
      return next(err);
    }
    return res.status(401)
      .send(ResponseMaker.unauthorized('Invalid email or password!'));
  }

  static async logout(req, res, next) {
    try {
      await req.session.token.deactivate();
    } catch (err) {
      return next(err);
    }
    return next();
  }

  static async forgot(req, res, next) {
    try {
      const user = await User.getByEmail(req.body.mail);
      if (user.id) {
        const token = await Token.getValidToken(user.id, Token.reset);
        if (token.token) {
          mailer.sendMail(MailMaker.reset(user.mail, token.token));
        }
      }
    } catch (err) {
      return next(err);
    }
    return res.send('Check your email :)');
  }

  static async reset(req, res, next) {
    const { key } = req.query;
    const { password } = req.body;
    try {
      const token = await Token.get(key, Token.reset);
      if (token.token) { // si es un token valido
        const validToken = await token.isActive();
        if (validToken) {
          const user = await User.get(token.userId);
          await user.update({
            password: await User.hashPassword(password),
          });
          token.deactivate();
          Auth.sendMsg(user, Auth.passwordChangedMsg, false); // no enviar token
          return res.status(200)
            .send(ResponseMaker.ok('Password reset succesfully'));
        }
      }
    } catch (err) {
      return next(err);
    }
    return res.status(409).send({ status: 409, msg: 'Expired token!' });
  }

  static async confirm(req, res, next) {
    const { key } = req.query;
    try {
      const token = await Token.get(key, Token.confirm);
      if (token.token) { // si es un token valido
        const validToken = await token.isActive();
        if (validToken) {
          const user = await User.get(token.userId);
          await user.confirm();
          await token.deactivate();
          return res.status(200)
            .send(ResponseMaker.ok('Confirmation succesfully!'));
        }
      }
    } catch (err) {
      return next(err);
    }
    return res.status(409).send({ status: 409, msg: 'Expired token!' });
  }

  static async sendMsg(user, typeName, requireToken = true) {
    try {
      if (requireToken) {
        const token = await Token.getValidToken(user.id, Token[typeName]);
        if (token.token) {
          mailer.sendMail(MailMaker[typeName](user.mail, token));
        }
      } else {
        mailer.sendMail(MailMaker[typeName](user.mail));
      }
    } catch (err) {
      throw err;
    }
  }
}

Auth.type = 'auth';
Auth.resetMsg = 'reset';
Auth.confirmMsg = 'confirm';
Auth.passwordChangedMsg = 'passwordChanged';

module.exports = Auth;
