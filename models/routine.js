const db = require('../db');
const Exercise = require('./exercise');

class Routine {
  constructor({ id, name, description, executionTime })
  {
    this.id = id;
    this.name = name;
    this.description = description;
    this.executionTime = executionTime;
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

  static async create({ name, description, executionTime }) {
    let response;
    try {
      response = await db.insert('routines', { name, description, executionTime });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (id > 0) {
      return new Routine({
        id, name, description, executionTime,
      });
    }
    return [];
  }

  async update(fields) {
    let updatedRows;
    try {
      const results = await db.update('routines', fields, this.id);
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

  static async addExercise(routineId, { exerciseId, repetitions }) {
    let response;
    try {
      response = await db.insert('exercises_routines', { routineId, exerciseId, repetitions });
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
      exercise.repetitions = row.repetitions;
      response.push(exercise);
    });
    await Promise.all(myPromises);
    return response;
  }

  static async removeExercise(routineId, { exerciseId }) {
    let deletedRows;
    try {
      const results = await db.adv_delete('exercises_routines', { routineId, exerciseId });
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async updateExerciseReps(routineId, { exerciseId, repetitions }) {
    let updatedRows;
    try {
      const results = await db.adv_update('exercises_routines', { repetitions }, { routineId, exerciseId });
      updatedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return updatedRows > 0;
  }

}

module.exports = Routine;
