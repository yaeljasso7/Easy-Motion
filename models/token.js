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

  static async create({
    token, userId, type, createdAt, expires, active,
  }) {
    let res;
    try {
      res = await db.insert('tokens', {
        token, userId, type, createdAt, expires, active,
      });
    } catch (e) {
      throw e;
    }

    const id = res.insertId;
    if (id > 0) {
      return new Token({
        id, token, userId, type, createdAt, expires, active,
      });
    }
    return [];
  }
}

module.exports = Token;
