const db = require('../db');
const categoryBlog = require('./categoryBlog');
const generic = require('./generic');

/**
 * @class Blog
 * Represents an blog
 */
class Blog {
  /**
   * Blog constructor
   * @param {Number} id            - The blog id
   * @param {String} date          - The date publicated
   * @param {String} title          - The title blog
   * @param {String} autor         - The autor
   * @param {int} categoryBlog     - The reference id of the categoryBlog
   */
  constructor({
    id, date, autor, data, category, title,
  }) {
    this.id = id;
    this.date = date;
    this.autor = autor;
    this.data = data;
    this.category = category;
    this.title = title;
  }

  /**
   * @method getAll - Retrieve all the blogs from a page
   *
   * @param  {Number}  [page=0]             - The page to retrieve the blog
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents, the blog from that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }, deletedItems = false) {
    const pageSize = Number(process.env.PAGE_SIZE);
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Blog.vTable,
        where: { ...filters, ...cond },
        sorter,
        desc,
        limit: [page * pageSize, pageSize],
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
      cond.isDeleted = false;
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
   * @method create - Inserts a blog into the database
   *
   * @param {Number} id            - The blog id
   * @param {String} date          - The date publicated
   * @param {String} title         - The title blog
   * @param {String} autor         - The autor
   * @param {int} category         - The reference id of the categoryBlog
   */
  static async create({
    autor, title, data, category, date,
  }) {
    let response;
    try {
      response = await db.insert({
        into: Blog.table,
        resource: {
          data, title, autor, category,
        },
      });
    } catch (e) {
      throw e;
    }
    const id = response.insertId;

    if (id > 0) {
      return new Blog({
        id, date, title, autor, data, category,
      });
    }
    return [];
  }

  /**
   * @method update - Modifies fields from this blog.
   *
   * @param  {Object}  keyVals - Represents the new values for this blog.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */

  async update(keyVals) {
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
   * @method delete - Deletes this blog
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  static async deleteBlog() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: Blog.table,
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


Blog.table = 'blogs';
Blog.vTable = `v_${Blog.table}`;
Blog.exists = generic.exists(Blog.table);
Blog.ValidFilters = {
  autor: 'asString',
  title: 'asString',
  category: 'asString',
};
module.exports = Blog;
