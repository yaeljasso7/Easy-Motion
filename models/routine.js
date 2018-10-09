const db = require('../db');
const Exercise = require('./exercise');

class Routine {
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  static async getAll() {
    const data = await db.getAll('routine');
    const response = [];
    data.forEach((row) => {
      response.push(new Routine(row));
    });
    return response;
  }

  static async get(routineId) {
    const data = await db.get('routine', routineId);
    return data.length !== 0 ? new Routine(data[0]) : data;
  }

  static async create({
    name,
  }) {
    let response;
    try {
      response = await db.insert('routine', {
        name,
      });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new Routine({
        id, name,
      });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('routine', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(routineId) {
    let deletedRows;
    try {
      const results = await db.delete('routine', routineId);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  

}

module.exports = Routine;
