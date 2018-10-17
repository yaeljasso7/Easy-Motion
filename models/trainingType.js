const db = require('../db');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class TrainingType {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async getAll() {
    const data = await db.select('training_types', { isDeleted: false });
    const response = [];
    data.forEach((row) => {
      response.push(new TrainingType(row));
    });
    return response;
  }

  static async get(id) {
    const data = await db.select('training_types', { id, isDeleted: false });
    return data.length !== 0 ? new TrainingType(data[0]) : [];
  }

  static async create({ name, description }) {
    let response;
    try {
      response = await db.insert('training_types', { name, description });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new TrainingType({ id, name, description });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('training_types', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(id) {
    let deletedRows;
    try {
      const results = await db.adv_update('training_types', { isDeleted: true }, { id, isDeleted: false });
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }
    return deletedRows > 0;
  }
}

module.exports = TrainingType;
