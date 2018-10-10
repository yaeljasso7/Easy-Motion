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
    const data = await db.select('exercise');
    const response = [];
    data.forEach((row) => {
      response.push(new Exercise(row));
    });
    return response;
  }

  static async get(exerciseId) {
    const data = await db.select('exercise', { id: exerciseId });
    return data.length !== 0 ? new Exercise(data[0]) : [];
  }

  static async create({
    name, difficulty, description, trainingType, bodyPart,
  }) {
    let response;
    try {
      response = await db.insert('exercise', {
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
      res = await db.update('exercise', fields, this.id);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static async delete(exerciseId) {
    let deletedRows;
    try {
      const results = await db.delete('exercise', exerciseId);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }
}

module.exports = Exercise;
