const db = require('../db');
const Exercise = require('./exercise');

class Routine {
  constructor({id, name})
  {
    this.id = id;
    this.name = name;
  }

  static async getAll() {
    const data = await db.select('routines', { isDeleted: false });
    const response = [];
    data.forEach((row) => {
      response.push(new Routine(row));
    });
    return response;
  }

  static async get(id) {
    // si rutina tiene referenciado un ejercicio eliminado, aún se muestra
    // en la rutina, a menos que se elimine de esta.
    const data = await db.select('routines', { id, isDeleted: false });
    if (data.length !== 0) {
      const routine = new Routine(data[0]);
      routine.exercises = await Routine.getExercises(routine.id);
      return routine;
    }
    return data;
  }

  static async create({ name }) {
    let response;
    try {
      response = await db.insert('routines', { name });
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
      const results = await db.update('routines', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async delete(id) {
    let deletedRows;
    try {
      const results = await db.adv_update('routines', { isDeleted: true }, { id, isDeleted: false });
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }
    return deletedRows > 0;
  }

  static async addExercise(routineId, exerciseId) {
    let response;
    try {
      response = await db.insert('exercises_routines', { routineId, exerciseId });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { routineId, exerciseId };
    }
    return [];
  }

  static async getExercises(routineId) {
    const data = await db.select('exercises_routines', { routineId });
    const response = [];
    const myPromises = data.map(async (row) => {
      const exercise = await Exercise.get(row.exerciseId, true);
      response.push(exercise);
    });
    await Promise.all(myPromises);
    return response;
  }

  static async removeExercise(routineId, exerciseId) {
    let deletedRows;
    try {
      const results = await db.adv_delete('exercises_routines', { routineId, exerciseId });
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

}

module.exports = Routine;
