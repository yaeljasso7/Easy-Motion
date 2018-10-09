const db = require('../db');

class TrainingType {
  constructor({
    id, name, description,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static async getAll() {
    const data = await db.getAll('trainingType');
    const response = [];
    data.forEach((row) => {
      response.push(new TrainingType(row));
    });
    return response;
  }

  static async get(TrainingTypeId) {
    const data = await db.get('trainingType', TrainingTypeId);
    return data.length !== 0 ? new TrainingType(data[0]) : [];
  }

  static async create({
    name, description,
  }) {
    let response;
    try {
      response = await db.insert('trainingType', {
        name, description,
      });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new TrainingType({
        id, name,
      });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('trainingType', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(TrainingTypeId) {
    let deletedRows;
    try {
      const results = await db.delete('trainingType', TrainingTypeId);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }
}

module.exports = TrainingType;
