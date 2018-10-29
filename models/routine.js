const db = require('../db');
const Exercise = require('./exercise');
const generic = require('./generic');

/**
 * @class Routine
 * Represents an exercises routine
 */
class Routine {
  /**
   * @constructor
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
   * Database table which routines are located
   * @type {String}
   */
  static get table() {
    return 'routines';
  }

  /**
   * Database table which exercises, for each routine, are located
   * @type {String}
   */
  static get exercisesTable() {
    return 'exercises_routines';
  }

  /**
   * The Routine Valid Filters
   * @type {Object}
   */
  static get ValidFilters() {
    return {
      name: 'asString',
      executionTime: 'asNumber',
    };
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the routines from a page
   *
   * @param  {Number}  page - The page to retrieve the exercises
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @param  {Boolean} [deletedItems=false] - Include deleted items in result?
   * @return {Promise} [Array] - Promise Object represents, the routines from that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }, deletedItems = false) {
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Routine.table,
        where: { ...filters, ...cond },
        sorter,
        desc,
        limit: db.pageLimit(page),
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
   * @static @async
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
   * @static @async
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
   * @async
   * @method update - Modifies fields from this routine.
   *
   * @param  {Object}  keyVals - Represents the new values for this routine.
   * @return {Promise} [Boolean] - Promise Object, represents the operation success
   */
  async update({ name, description, executionTime }) {
    const keyVals = generic.removeEmptyValues({
      name, description, executionTime,
    });
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
   * @async
   * @method delete - Deletes this routine.
   *         Assigns true to isDeleted, in the database.
   * @return {Promise} [Boolean] - Promise Object represents the operation success (boolean)
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
   * @async
   * @method addExercise - Adds an exercise to this routine
   *
   * @param  {Number}  exerciseId  - The exercise id to be added
   * @param  {Number}  repetitions - The times an exercise must be repeated
   * @return {Promise} [Boolean] - Promise Object, represents the operation success
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
   * @async
   * @method getExercises - Retrieve all the exercises of this routine
   *
   * @return {Promise} [Array] - Promise Object, represents the exercises of this routine
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
   * @async
   * @method removeExercise - Removes an exercise from this routine
   *
   * @param  {Number}  exerciseId - The exercise id
   * @return {Promise} [Boolean] - Promise Object represents the operation success
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
   * @async
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
 * Checks if a routine exists in the database, based on its id
 * @type {asyncFunction}
 */
Routine.exists = generic.exists(Routine.table, 'id');

module.exports = Routine;
