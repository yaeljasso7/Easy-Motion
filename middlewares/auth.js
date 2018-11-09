const { Token, User, ResponseMaker } = require('../models');
const { mailer, MailMaker } = require('../mail');

/**
 * @class Auth
 * Manage authentication & authorization
 */
class Auth {
  /**
   * @static
   * @method getHeaderToken - Retrieve the token value
   * @param  {String} bearer - The header where the token is
   * @return {String} - The token
   */
  static getHeaderToken(bearer) {
    if (!bearer) {
      return '';
    }
    return bearer.split(' ')[1];
  }

  /**
   * @property type
   * @type {String}
   */
  static get type() {
    return 'Auth';
  }

  /**
   * @property resetMsg
   * The reset message typename
   * @type {String}
   */
  static get resetMsg() {
    return 'reset';
  }

  /**
   * @property resetMsg
   * The confirm message typename
   * @type {String}
   */
  static get confirmMsg() {
    return 'confirm';
  }

  /**
   * @property resetMsg
   * The password changed message typename
   * @type {String}
   */
  static get passwordChangedMsg() {
    return 'passwordChanged';
  }

  /**
   * @static @async
   * @method haveSession - It checks if the user have a valid session
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async haveSession(req, res, next) {
    const hToken = Auth.getHeaderToken(req.headers.authorization);
    try {
      const token = await Token.get(hToken, Token.session);
      if (token.token) {
        req.session = {
          token,
          user: await User.get(token.userId),
        };
        return next();
      }
    } catch (err) {
      return next(err);
    }
    return next(ResponseMaker.forbidden('You need to be logged!'));
  }

  /**
   * @static @async
   * @method havePermission - It checks if the user have the permission
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static havePermission(req, res, next, permission) {
    const { user } = req.session;
    if (!user.confirmed) {
      return next(ResponseMaker.unauthorized('Your account is not confirmed yet!'));
    }
    if (user.canDo(permission)) {
      const condition = user.permissions[permission];
      if (condition) {
        if (Auth[condition](req)) {
          return next();
        }
      } else {
        return next();
      }
    }
    return next(ResponseMaker.forbidden('You have no permission to do this!'));
  }

  /**
   * @static
   * @method equalsId - Checks whether the user param is equals to user session
   *
   * @param  {Object} req  - The Request Object
   * @param  {User}   user - The user, to compare with
   * @return {Boolean}     - whether the param userId is equals to the user id
   */
  static equalsId(req) {
    return req.session.user.id === Number(req.params.userId);
  }

  /**
   * @static @async
   * @method register - Registers a user in the system
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async register(req, res, next) {
    try {
      const user = await User.create(req.body);
      if (user.length !== 0) {
        Auth.sendMsg(user, Auth.confirmMsg);
        return res.status(201)
          .send(ResponseMaker.created({
            type: Auth.type,
            msg: 'Register successfully',
          }));
      }
      return next(ResponseMaker.conflict({
        type: Auth.type,
        data: user,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * @static @async
   * @method login - User login
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await User.login(email, password);
      if (user.id) {
        const token = await Token.create({ userId: user.id, type: Token.session });
        if (!token.token) {
          return next(ResponseMaker.conflict({
            msg: 'Cannot create the token',
            type: Auth.type,
            data: email,
          }));
        }
        return res.send(ResponseMaker.ok({
          msg: 'Logged in!',
          type: Auth.type,
          data: token,
        }));
      }
    } catch (err) {
      return next(err);
    }
    return next(ResponseMaker.unauthorized('Invalid email or password!'));
  }

  /**
   * @static @async
   * @method logout - User logout
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async logout(req, res, next) {
    try {
      await req.session.token.deactivate();
    } catch (err) {
      return next(err);
    }
    return next();
  }

  /**
   * @static @async
   * @method forgot - User password recovery
   * Sends a token to the user email, in order to reset the password
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async forgot(req, res, next) {
    try {
      const user = await User.getByEmail(req.body.email);
      if (user.id) {
        await Auth.sendMsg(user, Auth.resetMsg);
      }
    } catch (err) {
      return next(err);
    }
    return res.send(ResponseMaker.ok({
      msg: 'Check your email :)',
    }));
  }

  /**
   * @static @async
   * @method reset - User password reset
   * Set the new user password
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async reset(req, res, next) {
    const { key } = req.query;
    const { password } = req.body;
    try {
      const token = await Token.get(key, Token.reset);
      if (token.token) {
        const user = await User.get(token.userId);
        await user.update({
          password: await User.hashPassword(password),
        });
        await token.deactivate();
        Auth.sendMsg(user, Auth.passwordChangedMsg, false);
        return res.send(ResponseMaker.ok({
          msg: 'Password reset succesfully',
        }));
      }
    } catch (err) {
      return next(err);
    }
    return next(ResponseMaker.confict({ msg: 'Expired token!' }));
  }

  /**
   * @static @async
   * @method confirm - Confirms the user email
   *
   * @param  {Object}   req  - The Request Object
   * @param  {Object}   res  - The Response Object
   * @param  {Function} next - The next function in the cycle
   * @return {Promise} - Promise object, represents the next function
   */
  static async confirm(req, res, next) {
    const { key } = req.query;
    try {
      const token = await Token.get(key, Token.confirm);
      if (token.token) {
        const user = await User.get(token.userId);
        await user.confirm();
        await token.deactivate();
        return res.send(ResponseMaker.ok({
          msg: 'Confirmation succesfully!',
        }));
      }
    } catch (err) {
      return next(err);
    }
    return next(ResponseMaker.conflict({ msg: 'Expired token!' }));
  }

  /**
   * @static @async
   * @method sendMsg - Sends a mail to an existing user
   *
   * @param  {Object}  user                - The user to send the mail
   * @param  {String}  typeName            - The message typename
   * @param  {Boolean} [requireToken=true] - Whether send or not a token in the message
   * @return {Promise} - Promise object, represents the current operation
   */
  static async sendMsg(user, typeName, requireToken = true) {
    try {
      if (requireToken) {
        const token = await Token.getValidToken(user.id, Token[typeName]);
        if (token.token) {
          mailer.sendMail(MailMaker[typeName](user.email, token.token));
        }
      } else {
        mailer.sendMail(MailMaker[typeName](user.email));
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Auth;
