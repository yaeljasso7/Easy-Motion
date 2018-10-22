const bcrypt = require('bcrypt');
const db = require('../db');

class Token {
  constructor({
    id, token, userId, type, createdAt, expires, active,
  }) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.type = type;
    this.createdAt = createdAt;
    this.expires = expires;
    this.active = active;
  }

  async isActive() {
    if (!this.active) {
      return false;
    }
    const now = new Date();
    if (now < this.createdAt + this.expires) {
      try {
        await this.deactivate();
      } catch (err) {
        throw err;
      }
      return false;
    }
    return true;
  }

  static async create({ userId, type }) {
    const createdAt = new Date();
    try {
      const token = await bcrypt.hash(`${Token.Secret}${userId}${createdAt}`, Token.SaltRounds);
      const response = await db.insert({
        into: 'tokens',
        resource: {
          token,
          type,
          createdAt,
          expires: Token.SessionLives,
          active: 1,
          userId,
        },
      });
      if (response.insertId > 0) {
        return { userId, token };
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async get(token) {
    const cond = { token };
    try {
      const data = await db.select({
        from: 'tokens',
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        const itoken = new Token(data[0]);
        return itoken;
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async getActiveToken(userId) {
    try {
      const data = await db.select({
        from: 'tokens',
        where: {
          userId,
          active: true,
        },
      });
      if (data.length !== 0) {
        const token = new Token(data[0]);
        const validToken = await token.isActive();
        if (validToken) {
          return {
            userId: token.userId,
            token: token.token,
          };
        }
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  async deactivate() {
    this.active = false;
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: 'tokens',
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

Token.Secret = process.env.SECRET;
Token.SaltRounds = parseInt(process.env.SALT, 10);
Token.SessionLives = parseInt(process.env.SESSION_LIVES, 10);

module.exports = Token;
