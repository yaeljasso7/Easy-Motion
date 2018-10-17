const db = require('../db');

// FIXME Falta documentacion en todos los metodos

class BodyPart {
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  static async getAll(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select('body_parts', { isDeleted: false }, [page * pageSize, pageSize]);

      data.forEach((row) => {
        response.push(new BodyPart(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async get(id) {
    let data;
    try {
      data = await db.select('body_parts', { id, isDeleted: false }, [1]);
    } catch (err) {
      throw err;
    }
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
      const results = await db.advUpdate('body_parts', keyVals, { id: this.id });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }

  static async delete(id) {
    let deletedRows;
    try {
      const results = await db.advUpdate('body_parts', { isDeleted: true }, { id, isDeleted: false });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return deletedRows > 0;
  }
}

module.exports = BodyPart;
