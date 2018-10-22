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
    const hash = await bcrypt.hash(process.env.SECRET, 10);

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

  static async hashPassword(pass) {
    const hash = await bcrypt.hash(pass, 1);
    return hash;
  }

  static async checkPassword(pass, hash) {
    // pass - body / hash - db
    // console.log('pass: ', pass);
    // console.log('hash: ', hash);
    const check = bcrypt.compare(pass, hash);
    return check;
  }

  async deactivate(keyVals) {
    console.log('keyVals', keyVals);
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: 'tokens',
        assign: keyVals,
        where: {
          id: this.id,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }
}

module.exports = Token;
