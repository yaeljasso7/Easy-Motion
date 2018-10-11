const db = require('../db');

class BodyPart {
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  static async getAll() {
    const data = await db.select('body_parts', { isDeleted: false });
    const response = [];
    data.forEach((row) => {
      response.push(new BodyPart(row));
    });
    return response;
  }

  static async get(id) {
    const data = await db.select('body_parts', { id, isDeleted: false });
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
      return new BodyPart({ id, name });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('body_parts', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(id) {
    const data = await BodyPart.get(id);
    if (data.length === 0) {
      return false;
    }
    let deletedRows;
    try {
      const results = await db.update('body_parts', { isDeleted: true }, id);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }
    return deletedRows > 0;
  }


}

module.exports = BodyPart;
