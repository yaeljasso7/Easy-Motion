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

  static async getAll() {
    const data = await db.select('exercises', { isDeleted: false });
    const response = [];
    data.forEach((row) => {
      response.push(new Exercise(row));
    });
    return response;
  }

  static async get(id) {
    const data = await db.select('exercises', { id, isDeleted: false });
    return data.length !== 0 ? new Exercise(data[0]) : [];
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
    const data = await Exercise.get(id);
    if (data.length === 0) {
      return false;
    }
    let deletedRows;
    try {
      const results = await db.update('exercises', { isDeleted: true }, id);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }
    return deletedRows > 0;
  }
}

module.exports = Exercise;
