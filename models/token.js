const bcrypt = require('bcrypt');
const db = require('../db');

/**
 * @class Token
 * Represents a token in the system
 */
class Token {
  /**
   * @constructor Token
   *
   * @param {Number}  id        The token identifier
   * @param {String}  token     The generated unique token
   * @param {Number}  userId    The user identifier whom the token belongs
   * @param {String}  type      The token type
   * @param {Date}    createdAt The date which the token has been created
   * @param {Number}  expires   The expiration time
   * @param {Boolean} active    whether the token is active
   */
  constructor({
    id, token, userId, type, createdAt, expires, active,
  }) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.type = type;
    this.createdAt = new Date(createdAt);
    this.expires = expires;
    this.active = active;
  }

  /**
   * @property table
   * @type {String} - The Database table which the tokens are stored
   */
  static get table() {
    return 'tokens';
  }

  /**
   * @property session
   * @type {String} - Represents a session token type
   */
  static get session() {
    return 's';
  }

  /**
   * @property confirm
   * @type {String} - Represents a confirm token type
   */
  static get confirm() {
    return 'c';
  }

  /**
   * @property reset
   * @type {String} - Represents a reset token type
   */
  static get reset() {
    return 'r';
  }

  /**
   * @property expireTime
   * @type {Object} - An object with the token types and its expire time.
   */
  static get expireTime() {
    return {
      s: Number(process.env.SESSION_LIVES),
      c: Number(process.env.CONFIRM_LIVES),
      r: Number(process.env.RESET_LIVES),
    };
  }

  /**
   * @async
   * @method isActive - Checks if the current token is still active
   *
   * @return {Promise} - Promise object, represents if the token is still active
   */
  async isActive() {
    if (!this.active) {
      return false;
    }
    const now = Date.now();
    console.log('now: ', now);
    console.log('this.createdAt: ', this.createdAt.getTime());
    console.log('expires', this.expires);
    if (now >= this.createdAt.getTime() + this.expires) {
      try {
        await this.deactivate();
      } catch (err) {
        throw err;
      }
      return false;
    }
    return true;
  }

  /**
   * @static @async
   * @method create - Creates a token of a specific type
   *
   * @param  {Number}  userId - The user identifier to whom the token belongs
   * @param  {String}  type - The token type, to be generated
   * @return {Promise} - Promise object, represents the pair (userId, token)
   */
  static async create({ userId, userRole, type }) {
    const createdAt = new Date();
    try {
      const token = await bcrypt.hash(`${process.env.SECRET}${userId}${createdAt}`, Number(process.env.SALT));
      const response = await db.insert({
        into: Token.table,
        resource: {
          token,
          type,
          createdAt,
          expires: Token.expireTime[type],
          active: 1,
          userId,
        },
      });
      if (response.insertId > 0) {
        return { userId, userRole, token };
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  /**
   * @static @async
   * @method get - Retrieve an active token
   *         Searches in Database for the token.
   *         Returns the token if it's still active.
   *
   * @param  {String}  token - The token to be matched in Database.
   * @param  {String}  [type=Token.session] - The token type.
   * @return {Promise} - Promise object, represents the token.
   */
  static async get(token, type = Token.session) {
    console.log(type);
    console.log(token);
    try {
      const data = await db.select({
        from: Token.table,
        where: {
          token,
          type,
          active: true,
        },
        limit: 1,
      });
      console.log(data);
      if (data.length !== 0) {
        const tk = new Token(data[0]);
        const validToken = await tk.isActive();
        if (validToken) {
          return tk;
        }
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  /**
   * @static @async
   * @method deactivateAll - It deactivates all tokens that match userId and type
   *
   * @param  {Number}  userId               - The userId, to deactivate the tokens
   * @param  {String}  [type=Token.session] - The token type, to be deactivate
   * @return {Promise} - Promise object, represents such operation
   */
  static async deactivateAll(userId, type = Token.session) {
    try {
      await db.advUpdate({
        table: Token.table,
        assign: {
          active: false,
        },
        where: {
          userId,
          type,
          active: true,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  /**
   * @static @async
   * @method getValidToken - Returns a valid token, keeping only one of this type
   *         Calls deactivateAll, and then create a new token.
   *
   * @param  {Number}  userId - The user identifier, to whom the token belongs.
   * @param  {String}  [type=Token.session] - The returned token type.
   * @return {Promise} - Promise object, represents the valid token.
   */
  static async getValidToken(userId, type = Token.session) {
    try {
      await Token.deactivateAll(userId, type);
      const token = await Token.create({ userId, type });
      return token;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @async
   * @method deactivate - It deactivates the current token
   *
   * @return {Promise} - Promise object, represents the success operation
   */
  async deactivate() {
    this.active = false;
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: Token.table,
        assign: {
          active: this.active,
        },
        where: {
          id: this.id,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows > 0;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }
}

module.exports = Token;
