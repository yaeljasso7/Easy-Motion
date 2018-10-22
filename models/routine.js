const db = require('../db');
const Exercise = require('./exercise');
const generic = require('./generic');

/**
 * @class Routine
 * Represents an exercises routine
 */
class Routine {
  /**
   * Routine constructor
   * @param {Number} id            - The routine id
   * @param {String} name          - The routine name
   * @param {String} description   - The routine description
   * @param {String} executionTime - The estimated execution time, in minutes.
   */
  constructor({
    id, name, description, executionTime,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.executionTime = executionTime;
  }

  /**
   * @method getAll - Retrieve all the routines from a page
   *
   * @param  {Number}  [page=0]             - The page to retrieve the routines
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents, the routines from that page
   */
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

  /**
   * @method get - Retrieve a routine and its exercises, based on their id
   *
   * @param  {Number}  id - The routine identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents a routine
   */
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

  /**
   * @method create - Inserts a routine into the database
   *
   * @param {String} name          - The routine name
   * @param {String} description   - The routine description
   * @param {String} executionTime - The estimated execution time, in minutes.
   */
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

  /**
   * @method update - Modifies fields from this routine.
   *
   * @param  {Object}  keyVals - Represents the new values for this routine.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method delete - Deletes this routine.
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method addExercise - Adds an exercise to this routine
   * @param  {Number}  exerciseId  - The exercise id to be added
   * @param  {Number}  repetitions - The times an exercise must be repeated
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method getExercises - Retrieve all the exercises of this routine
   * @return {Promise} - Promise Object represents the exercises of this routine
   */
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

  /**
   * @method removeExercise - Removes an exercise from this routine
   *
   * @param  {Number}  exerciseId - The exercise id
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method updateExerciseReps - Modifies the times an exercise must be repeated
   *         for this routine.
   *
   * @param  {Number}  exerciseId  - The exercise identifier, to modify its
   *         repetitions.
   * @param  {Number}  repetitions - The times this exercise must be repeated
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

/**
 * Database table which routines are located
 * @type {String}
 */
Routine.table = 'routines';
/**
 * Database table which exercises, for each routine, are located
 * @type {String}
 */
Routine.exercisesTable = 'exercises_routines';
/**
 * Checks if a routine exists in the database, based on its id
 * @type {[type]}
 */
Routine.exists = generic.exists(Routine.table);

module.exports = Routine;
