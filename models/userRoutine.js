const db = require('../db');

class userRoutine {
  constructor({
    id, idUser, idRoutine
  }) {
    this.id = id;
    this.idUser = idUser;
    this.idRoutine = idRoutine;
  }

  static async getAll() {
    const data = await db.getAll('userRoutine');
    const response = [];
    data.forEach((row) => {
      response.push(new userRoutine(row));
    });
    return response;
  }

  static async get(userRoutineId) {
    const data = await db.get('userRoutine', userRoutineId);
    return data.length !== 0 ? new userRoutine(data[0]) : [];
  }

  static async create({
    idUser, idRoutine,
  }) {
    let response;
    try {
      response = await db.insert('userRoutine', {
        idUser, idRoutine,
      });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new userRoutine({
        id, idUser, idRoutine,
      });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('userRoutine', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(userRoutineId) {
    let deletedRows;
    try {
      const results = await db.delete('userRoutine', userRoutineId);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }


}

module.exports = userRoutine;
