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

  static get table() {
    return 'tokens';
  }

  static get session() {
    return 's';
  }

  static get confirm() {
    return 'c';
  }

  static get reset() {
    return 'r';
  }

  static get expireTime() {
    return {
      s: Number(process.env.SESSION_LIVES),
      c: Number(process.env.CONFIRM_LIVES),
      r: Number(process.env.RESET_LIVES),
    };
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
        return { userId, token };
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async get(token, type = Token.session) {
    const cond = { token, type };
    try {
      const data = await db.select({
        from: Token.table,
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        return new Token(data[0]);
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async getActiveToken(userId, type = Token.session) {
    try {
      const data = await db.select({
        from: Token.table,
        where: {
          userId,
          type,
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

  static async getValidToken(userId, type = Token.session) {
    let token;
    try {
      token = await Token.getActiveToken(userId, type);
      if (!token.token) {
        token = await Token.create({ userId, type });
      }
    } catch (err) {
      throw err;
    }
    return token;
  }

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

// Token.secret = process.env.secret;
// Token.saltRounds = parseInt(process.env.SALT, 10);
// Token.sessionLives = parseInt(process.env.SESSION_LIVES, 10);
// Token.table = 'tokens';

module.exports = Token;
