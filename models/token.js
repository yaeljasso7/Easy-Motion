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

  static async createToken({ userId, type }) {
    let response;
    // creando hash
    const hash = await bcrypt.hash('chicharron', 15);

    // insertando hash en la db...
    try {
      if (hash) {
        response = await db.insert({
          into: 'tokens',
          resource: {
            token: hash,
            type,
            createdAt: new Date(),
            expires: 12,
            active: 0,
            userId,
          },
        });
        const id = response.insertId;
        if (id > 0) {
          return { userId, hash };
        }
      }
    } catch (e) {
      throw e;
    }
    return [];
  }
}

module.exports = Token;
