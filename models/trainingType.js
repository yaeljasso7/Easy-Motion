const db = require('../db');
const generic = require('./generic');

/**
 * @class TrainingType
 * Represents the training type that an exercise focuses on
 */
class TrainingType {
  /**
   * @constructor
   * @param {Number} id          - The training type id
   * @param {String} name        - The training type name
   * @param {String} description - The training type description
   */
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  /**
   * Database table which training types are located.
   * @type {String}
   */
  static get table() {
    return 'training_types';
  }

  /**
   * The TrainingType valid filters
   * @type {Object}
   */
  static get ValidFilters() {
    return {
      name: 'asString',
    };
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the training types from a page
   *
   * @param  {Number}  page - The page to retrieve the training types
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @return {Promise} [Array]- Promise Object, represents the training types
   *         from that page.
   */
  static async getAll({
    page, sorter, desc, filters,
  }) {
    const response = [];
    try {
      const data = await db.select({
        from: TrainingType.table,
        where: { ...filters, isDeleted: false },
        sorter,
        desc,
        limit: db.pageLimit(page),
      });
      data.forEach((row) => {
        response.push(new TrainingType(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @static @async
   * @method get - Retrieve a training type, based on its id
   *
   * @param  {Number}  id - The training type identifier
   * @return {Promise} [TrainingType]- Promise Object, represents the training type
   */
  static async get(id) {
    let data;
    try {
      data = await db.select({
        from: TrainingType.table,
        where: {
          id,
          isDeleted: false,
        },
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new TrainingType(data[0]) : [];
  }

  /**
   * @static @async
   * @method create - Inserts a training type into the database
   *
   * @param  {String}  name - The training type name
   * @param  {String}  description - The training type description
   * @return {Promise} [TrainingType]- Promise Object, represents the
   *         training type created
   */
  static async create({ name, description }) {
    let response;
    try {
      response = await db.insert({
        into: TrainingType.table,
        resource: {
          name,
          description,
        },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new TrainingType({ id, name, description });
    }
    return [];
  }

  /**
   * @async
   * @method update - Modifies fields from this training type.
   *
   * @param  {String}  name - The new name for this training type
   * @param  {String}  description - The new description for this training type
   * @return {Promise} [Boolean] - Promise Object, represents the operation success
   */
  async update({ name, description }) {
    const keyVals = generic.removeEmptyValues({ name, description });
    console.log(keyVals);
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: TrainingType.table,
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
   * @method delete - Deletes this training type.
   *         Assigns true to isDeleted, in the database.
   * @return {Promise} [Boolean] - Promise Object, represents the operation success
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: TrainingType.table,
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
 * Checks if a training type exists in the database, based on its id
 * @type {asyncFunction}
 */
TrainingType.exists = generic.exists(TrainingType.table, 'id');

module.exports = TrainingType;
