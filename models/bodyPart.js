const db = require('../db');

class BodyPart {
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  static async getAll() {
    const data = await db.getAll('bodyPart');
    const response = [];
    data.forEach((row) => {
      response.push(new BodyPart(row));
    });
    return response;
  }

  static async get(BodyPartId) {
    const data = await db.get('bodyPart', BodyPartId);
    return data.length !== 0 ? new BodyPart(data[0]) : [];
  }

  static async create({
    name,
  }) {
    let response;
    try {
      response = await db.insert('bodyPart', {
        name,
      });
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

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('bodyPart', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(BodyPartId) {
    let deletedRows;
    try {
      const results = await db.delete('bodyPart', BodyPartId);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }


}

module.exports = BodyPart;
