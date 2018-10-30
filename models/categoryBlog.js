const db = require('../db');
const generic = require('./generic');

/**
 * @class CategoryBlog
 * Represents the category types that a blog focuses on
 */
class CategoryBlog {
  /**
   * @constructor
   * @param {Number} id   - The category type id
   * @param {String} name - The category type name
   */
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  /**
   * Database table which category types are located.
   * @type {String}
   */
  static get table() {
    return 'blogs_categories';
  }

  /**
   * The Category valid filters
   * @type {Object}
   */
  static get ValidFilters() {
    return {
      name: 'asString',
    };
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the category types from a page
   *
   * @param  {Number}  page - The page to retrieve the body parts
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @return {Promise} - Promise Object represents, the category types
   * from that page.
   */
  static async getAll({
    page, sorter, desc, filters,
  }) {
    const response = [];
    try {
      const data = await db.select({
        from: CategoryBlog.table,
        where: { ...filters, deleted: false },
        sorter,
        desc,
        limit: db.pageLimit(page),
      });
      data.forEach((row) => {
        response.push(new CategoryBlog(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @static @async
   * @method get - Retrieve a category type, based on its id
   *
   * @param  {Number}  id - The category type identifier
   * @return {Promise} - Promise Object represents a category type
   */
  static async get(id) {
    let data;
    try {
      data = await db.select({
        from: CategoryBlog.table,
        where: {
          id,
          deleted: false,
        },
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new CategoryBlog(data[0]) : [];
  }

  /**
   * @static @async
   * @method create - Inserts a category type into the database
   *
   * @param  {String}  name - The category type name
   * @param  {String}  description - The category type description
   * @return {Promise} - Promise Object represents the category type created
   */
  static async create({ name }) {
    let response;
    try {
      response = await db.insert({
        into: CategoryBlog.table,
        resource: {
          name,
        },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new CategoryBlog({ id, name });
    }
    return [];
  }

  /**
   * @async
   * @method update - Modifies fields from this category type.
   *
   * @param  {Object}  name - Represents the new name for this category type.
   * @return {Promise} - Promise Object represents the the operation success (boolean)
   */
  async update({ name }) {
    const keyVals = generic.removeEmptyValues({ name });
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: CategoryBlog.table,
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
   * @method delete - Deletes this category type.
   *         Assigns true to deleted, in the database.
   * @return {Promise} [Boolean] - Promise Object represents the operation success
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: CategoryBlog.table,
        assign: {
          deleted: true,
        },
        where: {
          id: this.id,
          deleted: false,
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
 * Checks if a category type exists in the database, based on its id
 * @type {asyncFunction}
 */
CategoryBlog.exists = generic.exists(CategoryBlog.table, 'id');

module.exports = CategoryBlog;
