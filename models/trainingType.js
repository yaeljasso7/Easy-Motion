const db = require('../db');

class TrainingType {
  constructor({ id, name, isDeleted }) {
    this.id = id;
    this.name = name;
    this.isDeleted = isDeleted;
  }

  static async getAll() {
    const data = await db.getAll('training_types');
    const response = [];
    data.forEach((row) => {
      response.push(new TrainingType(row));
    });
    return response;
  }

  static async get(TrainingTypeId) {
    const data = await db.get('training_types', TrainingTypeId);
    return data.length !== 0 ? new TrainingType(data[0]) : [];
  }

  static async create({ name }) {
    let response;
    try {
      response = await db.insert('training_types', { name });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new TrainingType({ id, name });
    }
    return [];
  }

  static async update(trainingTypeId, fields) {
    let res;
    try {
      res = await db.update('training_types', fields, trainingTypeId);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static async delete(trainingTypeId) {
    let res;
    try {
      res = await TrainingType.update(trainingTypeId, { isDeleted: true });
    } catch (err) {
      throw err;
    }
    return res;
  }
}

module.exports = TrainingType;
