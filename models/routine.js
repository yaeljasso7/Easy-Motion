const db = require('../db');

class Routine {
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  static async getAll() {
    const data = await db.getAll('routines');
    const response = [];
    data.forEach((row) => {
      response.push(new Routine(row));
    });
    return response;
  }

  static async get(routineId) {
    const data = await db.get('routines', routineId);
    return data.length !== 0 ? new Routine(data[0]) : [];
  }

  static async create({
    name,
  }) {
    let response;
    try {
      response = await db.insert('routines', {
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

  static async update(routineId, fields) {
    let res;
    try {
      res = await db.update('routines', fields, routineId);
    } catch (err) {
      throw err;
    }
    return res.affectedRows > 0;
  }

  static delete(routineId) {

  }
}

module.exports = Routine;
