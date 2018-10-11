const db = require('../db');

class Exercise {
  constructor({
    id, name, difficulty, description, trainingType, bodyPart,
  }) {
    this.id = id;
    this.name = name;
    this.difficulty = difficulty;
    this.description = description;
    this.trainingType = trainingType;
    this.bodyPart = bodyPart;
  }

  static async getAll(deleted_items = false) {
    const cond = {};
    if (!deleted_items) cond.isDeleted = false;
    const data = await db.select('v_exercises', cond);
    const response = [];
    data.forEach((row) => {
      response.push(new Exercise(row));
    });
    return response;
  }

  static async get(id, deleted_items = false) {
    const cond = { id };
    if (!deleted_items) cond.isDeleted = false;
    const data = await db.select('v_exercises', cond);
    console.log(data);
    return data.length !== 0 ? new Exercise(data[0]) : data;
  }

  static async create({
    name, difficulty, description, trainingType, bodyPart,
  }) {
    let response;
    try {
      response = await db.insert('exercises', {
        name, difficulty, description, trainingType, bodyPart,
      });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new Exercise({
        id, difficulty, description, trainingType, bodyPart,
      });
    }
    return [];
  }

 async update(fields) {
    let res;
    try {
      res = await db.update('exercises', fields, this.id);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static async delete(id) {
    let deletedRows;
    try {
      const results = await db.adv_update('exercises', { isDeleted: true }, { id, isDeleted: false });
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }
    return deletedRows > 0;
  }
}

module.exports = Exercise;
