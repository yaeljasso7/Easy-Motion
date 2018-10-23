const db = require('../db');
const generic = require('./generic');

/**
 * @class CategoryBlog
 * Represents the categorys type that an exercise focuses on
 */
class CategoryBlog {
  /**
   * CategoryBlog constructor
   * @param {Number} id          The categorys type id
   * @param {String} name        The categorys type name
   */
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  /**
   * @method getAll - Retrieve all the categorys types from a page
   *
   * @param  {Number}  [page=0] - The page to retrieve the categorys types
   * @return {Promise} - Promise Object represents, the categorys types
   * from that page.
   */
  static async getAll({
    page, sorter, desc, filters,
  }) {
    const pageSize = Number(process.env.PAGE_SIZE);
    const response = [];
    try {
      const data = await db.select({
        from: CategoryBlog.table,
        where: { ...filters, isDeleted: false },
        sorter,
        desc,
        limit: [page * pageSize, pageSize],
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
   * @method get - Retrieve a categorys type, based on its id
   *
   * @param  {Number}  id - The categorys type identifier
   * @return {Promise} - Promise Object represents a categorys type
   */
  static async get(id) {
    let data;
    try {
      data = await db.select({
        from: CategoryBlog.table,
        where: {
          id,
          isDeleted: false,
        },
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    // FIXME En lugar de regresar el objeto de DB para vacio, debes construir
    // tu propio objeto en el manejador de la base de datos
    return data.length !== 0 ? new CategoryBlog(data[0]) : [];
  }

  /**
   * @method create - Inserts a categorys type into the database
   * @param  {String}  name - The categorys type name
   * @param  {String}  description - The categorys type description
   * @return {Promise} - Promise Object represents the categorys type created
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
   * @method update - Modifies fields from this categorys type.
   *
   * @param  {Object}  keyVals - Represents the new values for this categorys type.
   * @return {Promise} - Promise Object represents the the operation success (boolean)
   */
  async update(keyVals) {
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
   * @method delete - Deletes this categorys type.
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: CategoryBlog.table,
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
 * Database table which categorys types are located.
 * @type {String}
 */
CategoryBlog.table = 'blogs_categories';
/**
 * Checks if a categorys type exists in the database, based on its id
 * @type {asyncFunction}
 */
CategoryBlog.exists = generic.exists(CategoryBlog.table);

CategoryBlog.ValidFilters = {
  name: 'asString',
};

module.exports = CategoryBlog;
