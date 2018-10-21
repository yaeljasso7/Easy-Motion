const db = require('../db');
const Exercise = require('./exercise');
const generic = require('./generic');

// FIXME Falta documentacion en todos los metodos

class Routine {
  constructor({
    id, name, description, executionTime,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.executionTime = executionTime;
  }

  static async getAll(page = 0, deletedItems = false) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Routine.table,
        where: cond,
        limit: [page * pageSize, pageSize],
      });
      data.forEach((row) => {
        response.push(new Routine(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async get(id, deletedItems = false) {
    const cond = { id };
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Routine.table,
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        const routine = new Routine(data[0]);
        routine.exercises = await routine.getExercises();
        return routine;
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async create({ name, description, executionTime }) {
    let response;
    try {
      response = await db.insert({
        into: Routine.table,
        resource: {
          name, description, executionTime,
        },
      });
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

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: Routine.table,
        assign: keyVals,
        where: {
          id: this.id,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: Routine.table,
        assign: {
          isDeleted: true,
        },
        where: {
          id: this.id,
          isDeleted: false,
        },
        limit: 1,
      });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return deletedRows > 0;
  }

  async addExercise({ exerciseId, repetitions }) {
    let response;
    try {
      response = await db.insert({
        into: Routine.exercisesTable,
        resource: {
          routineId: this.id,
          exerciseId,
          repetitions,
        },
      });
    } catch (err) {
      throw err;
    }
    return response.affectedRows > 0;
  }

  async getExercises() {
    const response = [];
    try {
      const data = await db.select({
        from: Routine.exercisesTable,
        where: {
          routineId: this.id,
        },
      });
      const myPromises = data.map(async (row) => {
        const exercise = await Exercise.get(row.exerciseId, true);
        exercise.repetitions = row.repetitions;
        response.push(exercise);
      });
      await Promise.all(myPromises);
    } catch (err) {
      throw err;
    }
    return response;
  }

  async removeExercise({ exerciseId }) {
    let deletedRows;
    try {
      const results = await db.advDelete({
        from: Routine.exercisesTable,
        where: {
          routineId: this.id,
          exerciseId,
        },
        limit: 1,
      });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }

    return deletedRows > 0;
  }

  async updateExerciseReps({ exerciseId, repetitions }) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: Routine.exercisesTable,
        assign: { repetitions },
        where: {
          routineId: this.id,
          exerciseId,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }
}

Routine.table = 'routines';
Routine.exercisesTable = 'exercises_routines';
Routine.exists = generic.exists(Routine.table);

module.exports = Routine;
