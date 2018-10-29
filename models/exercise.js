const db = require('../db');
const generic = require('./generic');

/**
 * @class Exercise
 * Represents an exercise
 */
class Exercise {
  /**
   * @constructor
   * @param {Number} id           - The exercise id
   * @param {String} name         - The exercise name
   * @param {Number} difficulty   - The exercise difficulty
   * @param {String} description  - The exercise description
   * @param {String} trainingType - the training type that an exercise focuses on
   * @param {String} bodyPart     - The body part that an exercise focuses on
   */
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

  /**
   * Database table which exercises are located.
   * @type {String}
   */
  static get table() {
    return 'exercises';
  }

  /**
   * Database view which the exercises are read.
   * @type {String}
   */
  static get vTable() {
    return `v_${Exercise.table}`;
  }

  /**
   * The Exercise Valid Filters
   * @type {Object}
   */
  static get ValidFilters() {
    return {
      name: 'asString',
      difficulty: 'asNumber',
      bodyPart: 'asString',
      trainingType: 'asString',
    };
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the exercises from a page
   *
   * @param  {Number}  page - The page to retrieve the exercises
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @param  {Boolean} [deletedItems=false] - Include deleted items in result?
   * @return {Promise} [Array] - Promise Object, represents the exercises from
   *         that page
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
        from: Exercise.vTable,
        where: { ...filters, ...cond },
        sorter,
        desc,
        limit: db.pageLimit(page),
      });
      data.forEach((row) => {
        response.push(new Exercise(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @static @async
   * @method get - Retrieve an exercise, based on its id
   *
   * @param  {Number}  id - The exercise identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} [Exercise] - Promise Object, represents an exercise
   */
  static async get(id, deletedItems = false) {
    let data;
    const cond = { id };
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      data = await db.select({
        from: Exercise.vTable,
        where: cond,
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new Exercise(data[0]) : [];
  }

  /**
   * @static @async
   * @method create - Inserts an exercise into the database.
   *
   * @param  {String}  name         - The exercise name
   * @param  {Number}  difficulty   - The exercise difficulty
   * @param  {String}  description  - The exercise description
   * @param  {Number}  trainingType - The training type identifier
   * @param  {Number}  bodyPart     - The body part identifier
   * @return {Promise} [Exercise] - Promise Object, represents the exercise created
   */
  static async create({
    name, difficulty, description, trainingType, bodyPart,
  }) {
    let response;
    try {
      response = await db.insert({
        into: Exercise.table,
        resource: {
          name, difficulty, description, trainingType, bodyPart,
        },
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

  /**
   * @async
   * @method update - Modifies fields from this exercise.
   *
   * @param  {Object}  keyVals - Represents the new values for this exercise.
   * @return {Promise} [Boolean]- Promise Object, represents the operation success
   */
  async update({
    name, difficulty, description, trainingType, bodyPart,
  }) {
    const keyVals = generic.removeEmptyValues({
      name, difficulty, description, trainingType, bodyPart,
    });
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: Exercise.table,
        assign: keyVals,
        where: {
          id: this.id,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }

  /**
   * @async
   * @method delete - Deletes this exercise.
   *         Assigns true to isDeleted, in the database.
   * @return {Promise} [Boolean] - Promise Object, represents the operation success
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: Exercise.table,
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
}

/**
 * Checks if an exercise exists in the database, based on its id
 * @type {asyncFunction}
 */
Exercise.exists = generic.exists(Exercise.table, 'id');

module.exports = Exercise;
