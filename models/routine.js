const db = require('../db');

class Routine {
  constructor({
    id, name, difficulty, executionTime,
    trainingType, bodyPart, url, isDeleted,
  }) {
    this.id = id;
    this.name = name;
    this.difficulty = difficulty;
    this.executionTime = executionTime;
    this.trainingType = trainingType;
    this.bodyPart = bodyPart;
    this.url = url;
    this.isDeleted = isDeleted;
  }

  static async getAll() {
    const data = await db.getAll('v_routines');
    const response = [];
    data.forEach((row) => {
      response.push(new Routine(row));
    });
    return response;
  }

  static async get(routineId) {
    const data = await db.get('v_routines', routineId);
    return data.length !== 0 ? new Routine(data[0]) : [];
  }

  static async create({
    name, difficulty, executionTime,
    trainingType, bodyPart, url,
  }) {
    let response;
    try {
      response = await db.insert('routines', {
        name, difficulty, executionTime, trainingType, bodyPart, url,
      });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new Routine({
        id, difficulty, executionTime, trainingType, bodyPart, url,
      });
    }
    return [];
  }

  static async update(routineId, fields) {
    let res;
    try {
      res = await db.update('routines', fields, routineId);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static async delete(routineId) {
    let res;
    try {
      res = await Routine.update(routineId, { isDeleted: true });
    } catch (err) {
      throw err;
    }
    return res;
  }
}

module.exports = Routine;
