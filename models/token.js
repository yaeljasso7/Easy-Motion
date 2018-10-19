const db = require('../db');

class Token {
  constructor({
    id, token, userId, type, createdAt, expires, active,
  }) {
    this.id = id;
    this.token = token;
    this.user_id = userId;
    this.type = type;
    this.created_at = createdAt;
    this.expires = expires;
    this.active = active;
  }

  async deactive() {
    this.active = false;
    try {
      const res = await db.advUpdate({
        table: 'tokens',
        assign: {
          active: this.active
        },
        where: {
          id: this.id,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  static async create({
    token, userId, type, createdAt, expires, active,
  }) {
    let res;
    try {
      res = await db.insert({
        into: 'tokens',
        resource: {
          token, userId, type, createdAt, expires, active,
        }
      });
    } catch (err) {
      throw err;
    }

    const id = res.insertId;
    if (id > 0) {
      return new Token({
        id, token, userId, type, createdAt, expires, active,
      });
    }
    return [];
  }

  static async get(token) {
    try {
      const data = await db.select({
        from: 'tokens',
        where: {
          token: token,
        }
      });
      if (data.length !== 0) {
        return new Token(data[0]);
      }
      return [];
    } catch (err) {
      throw err;
    }
  }

}

module.exports = Token;
