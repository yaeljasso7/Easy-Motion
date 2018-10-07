const db = require('../db');

class BodyPart {
  constructor({ id, name, isDeleted }) {
    this.id = id;
    this.name = name;
    this.isDeleted = isDeleted;
  }

  static async getAll() {
    const data = await db.getAll('body_parts');
    const response = [];
    data.forEach((row) => {
      response.push(new BodyPart(row));
    });
    return response;
  }

  static async get(BodyPartId) {
    const data = await db.get('body_parts', BodyPartId);
    return data.length !== 0 ? new BodyPart(data[0]) : [];
  }

  static async create({ name }) {
    let response;
    try {
      response = await db.insert('body_parts', { name });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new BodyPart({
        id, name,
      });
    }
    return [];
  }

  static async update(bodyPartId, fields) {
    let res;
    try {
      res = await db.update('body_parts', fields, bodyPartId);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static async delete(bodyPartId) {
    let res;
    try {
      res = await BodyPart.update(bodyPartId, { isDeleted: true });
    } catch (err) {
      throw err;
    }
    return res;
  }
}

module.exports = BodyPart;
