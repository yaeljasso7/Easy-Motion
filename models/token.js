const bcrypt = require('bcrypt');
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
    userId, type,
  }) {
    let response;
    let tok;
    bcrypt.hash('chicharron', 15, (err, hash) => {
      tok = hash;
    });
    try {
      response = await db.insert({
        into: 'token',
        resource: {
          token: tok,
          type,
          created_at: new Date(),
          duration: 12,
          active: 1,
          userId,
        },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return { userId, tok };
    }
    return [];
  }
}

module.exports = Token;
