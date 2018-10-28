const db = require('../db');
const generic = require('./generic');

/**
 * @class BodyPart
 * Represents the body part that an exercise focuses on
 */
class BodyPart {
  /**
   * @constructor
   * @param {Number} id   - The body part id
   * @param {String} name - The body part name
   */
  constructor({
    id, name,
  }) {
    this.id = id;
    this.name = name;
  }

  /**
   * Database table which body parts are located.
   * @type {String}
   */
  static get table() {
    return 'body_parts';
  }

  /**
   * The BodyPart valid filters
   * @type {Object}
   */
  static get ValidFilters() {
    return {
      name: 'asString',
    };
  }

  /**
   * @method getAll - Retrieve all the body parts from a page
   *
   * @param  {Number}  page - The page to retrieve the body parts
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @return {Promise} [Array]- Promise Object, represents the body parts from that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }) {
    const response = [];
    try {
      const data = await db.select({
        from: BodyPart.table,
        where: { ...filters, isDeleted: false },
        sorter,
        desc,
        limit: db.pageLimit(page),
      });

      data.forEach((row) => {
        response.push(new BodyPart(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @method get - Retrieve a body part, based on its id
   *
   * @param  {Number}  id - The body part identifier
   * @return {Promise} [BodyPart] - Promise Object, represents the body part
   */
  static async get(id) {
    let data;
    try {
      data = await db.select({
        from: BodyPart.table,
        where: {
          id,
          isDeleted: false,
        },
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new BodyPart(data[0]) : [];
  }

  /**
   * @method create - Inserts a body part into the database
   *
   * @param  {String}  name - The body part name
   * @return {Promise} [BodyPart] - Promise Object, represents the body part created
   */
  static async create({ name }) {
    let response;
    try {
      response = await db.insert({
        into: BodyPart.table,
        resource: {
          name,
        },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new BodyPart({ id, name });
    }
    return [];
  }

  /**
   * @method update - Modifies fields from this body part.
   *
   * @param  {String}  name - The new name for this body part.
   * @return {Promise} [Boolean] - Promise Object, represents the operation success.
   */
  async update({ name }) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: BodyPart.table,
        assign: { name },
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
   * @method delete - Deletes this body part.
   *         Assigns true to isDeleted, in the database.
   * @return {Promise} [Boolean] - Promise Object, represents the operation success.
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: BodyPart.table,
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
 * Checks if a body part exists in the database, based on its id
 * @type {asyncFunction}
 */
BodyPart.exists = generic.exists(BodyPart.table, 'id');

module.exports = BodyPart;
