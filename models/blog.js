const db = require('../db');
const generic = require('./generic');

/**
 * @class Blog
 * Represents a blog
 */
class Blog {
  /**
   * Blog constructor
   * @param {Number} id        - The blog identifier
   * @param {String} date      - The publication date
   * @param {String} title     - The blog title
   * @param {String} data      - The blog content
   * @param {String} author    - The blog author
   * @param {Number} category  - The reference id of the categoryBlog
   */
  constructor({
    id, date, author, data, category, title,
  }) {
    this.id = id;
    this.date = date;
    this.author = author;
    this.data = data;
    this.category = category;
    this.title = title;
  }

  static get table() {
    return 'blogs';
  }

  static get vTable() {
    return `v_${Blog.table}`;
  }

  static get ValidFilters() {
    return {
      author: 'asString',
      title: 'asString',
      category: 'asString',
    };
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the blogs from a page
   *
   * @param  {Number}  page - The page to retrieve the blogs
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents, the blog from that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }, deletedItems = false) {
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.deleted = false;
    }
    try {
      const data = await db.select({
        from: Blog.vTable,
        where: { ...filters, ...cond },
        sorter,
        desc,
        limit: db.pageLimit(page),
      });
      data.forEach((row) => {
        response.push(new Blog(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @static @async
   * @method get - Retrieve a blog
   *
   * @param  {Number}  id - The blog identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents a blog
   */
  static async get(id, deletedItems = false) {
    let data;
    const cond = { id };
    if (!deletedItems) {
      cond.deleted = false;
    }
    try {
      data = await db.select({
        from: Blog.vTable,
        where: cond,
        limit: 1,
      });
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new Blog(data[0]) : [];
  }

  /**
   * @static @async
   * @method create - Inserts a blog into the database
   *
   * @param {Number} id       - The blog id
   * @param {String} data     - The blog content
   * @param {String} title    - The blog title
   * @param {String} author   - The author name
   * @param {Number} category - The reference id of the categoryBlog
   * @return {Promise} [Blog] - The blog created
   */
  static async create({
    author, title, data, category,
  }) {
    let response;
    const date = new Date();
    try {
      response = await db.insert({
        into: Blog.table,
        resource: {
          date, data, title, author, category,
        },
      });
    } catch (e) {
      throw e;
    }
    const id = response.insertId;

    if (id > 0) {
      return new Blog({
        id, date, title, author, data, category,
      });
    }
    return [];
  }

  /**
   * @async
   * @method update - Modifies fields from this blog.
   *
   * @param  {Object}  keyVals - Represents the new values for this blog.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */

  async update({
    data, title, author, category,
  }) {
    const keyVals = generic.removeEmptyValues({
      data, title, author, category,
    });
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: Blog.table,
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
   * @method delete - Deletes this blog
   *         Assigns true to deleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: Blog.table,
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
 * Checks if a blog exists in the database, based on its id
 * @type {asyncFunction}
 */
Blog.exists = generic.exists(Blog.table, 'id');

module.exports = Blog;
