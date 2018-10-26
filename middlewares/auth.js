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

  static async forgot(req, res) {
    // trae usuario por mail
    const user = await User.getMail(req.body.mail);
    console.log(user);
    // genera token aleatorio
    const token = await Token.ramdomToken({ userId: user.id, type: '2' });
    console.log(token);
    // mandar correo a usuario con Token
    // mailer.sendMail({ to: 'christopher_x10x@hotmail.com' });
    mailer.sendMailRecover(user.mail, token);
    res.send('Check you email :)');
  }

  static async reset(req, res) {
    const { token } = req.params;
    // Issue: si el usuario inserta en los parametros un ejem  {{app}}/auth/reset/1
    // si trae el token por id?, aun que la condicion este buscando por token
    const myToken = await Token.get(token);
    console.log(myToken);

    res.send(req.body);
  }

  static async resetPass(req, res) {
    const { token } = req.params;
    const { pass, confirmpass } = req.body;
    const myToken = await Token.get(token);
    // verifica que la nueva contraseña
    if (pass === confirmpass) {
      // genera el hash de la nueva pass
      const password = await Token.getHashPass(pass);
      // actualiza la nueva pass hasheada al user
      const user = await User.get(myToken.userId);
      const updated = await user.update({ password });
      if (updated) {
        mailer.sendMailChanged({ to: user.mail });
        return res.status(200)
          .send(ResponseMaker.ok('Updated', 'user', { ...user }));
      // desactivar token
      }
    }
    return res.send('Las contraseñas no son iguales');

  static async confirm(req, res, next) {
    const hToken = req.params.token;
    try {
      const token = await Token.get(hToken, Token.confirm);
      if (token.token) {
        const validToken = await token.isActive();
        if (validToken) {
          const user = await User.get(token.userId);
          if (user.id) {
            user.confirm();
          }
          return next();
        }
      }
    } catch (err) {
      return next(err);
    }
    return next(ResponseMaker.conflict(0, 0, 'Invalid Operation!'));
  }

  static async sendMsg(user, typeName) {
    try {
      const token = await Token.getValidToken(user.id, Token[typeName]);
      if (token.token) {
        mailer.sendMail(MailMaker[typeName](user.mail, token));
      }
    } catch (err) {
      throw err;
    }
  }
}

Auth.type = 'auth';
Auth.resetMsg = 'reset';
Auth.confirmMsg = 'confirm';

module.exports = Auth;
