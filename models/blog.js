const db = require('../db');
const categoryBlog = require('./categoryBlog');

/**
 * @class Blog
 * Represents an blog
 */
class Blog {
  /**
   * Blog constructor
   * @param {Number} id            - The blog id
   * @param {String} date          - The date publicated
   * @param {String} autor         - The autor
   * @param {int} categoryBlog     - The reference id of the categoryBlog
   */
  constructor({
    id, date, autor, data, categoryBlog,
  }) {
    this.id = id;
    this.date = date;
    this.autor = autor;
    this.data = data;
    this.categoryBlog = categoryBlog;
  }

  /**
   * @method getAll - Retrieve all the blogs from a page
   *
   * @param  {Number}  [page=0]             - The page to retrieve the blog
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents, the blog from that page
   */
   static async getAll() {
     const data = await db.getAll('blog');
     const response = [];
     data.forEach((row) => {
       response.push(new Blog(row));
     });
     return response;
   }

   /**
    * @method get - Retrieve a routine and its exercises, based on their id
    *
    * @param  {Number}  id - The routine identifier
    * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
    * @return {Promise} - Promise Object represents a routine
    */
   static async get(id) {
    const data = await db.get('blog', id);

    // FIXME En lugar de regresar el objeto de DB para vacio, debes construir tu propio objeto en el manejador de la base de datos
    //return data.length !== 0 ? new Blog(data[0]) : data; //elemento 0 de rowDataPackege
    if (data.length !== 0) {
      const blog = new Blog(data[0]); //Row > Objeto User
      blog.categorys = await Blog.getCategory(blog.categoryBlog);
      return blog;
    }
  }

  /**
   * @method get - Retrieve a blog
   *
   * @param  {Number}  id - The blog identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents a blog
   */
  static async get(idCategory) {
    const response = [];
    const category = await categoryBlog.getcategoryBlog(idCategory);
    response.push(category);
    return response;
  }
  /**
   * @method create - Inserts a blog into the database
   *
   * @param {Number} id            - The blog id
   * @param {String} date          - The date publicated
   * @param {String} autor         - The autor
   * @param {int} categoryBlog     - The reference id of the categoryBlog
   */
  static async createBlog({ date, autor, data, categoryBlog}) {
    let response;
    try {
      response = await db.insert('blog', { date, autor, data, categoryBlog });
    } catch (e) {
      throw e;
    }
    const id = response.insertId;
    if (id > 0) {
      return new Blog({ id, date, autor, data, categoryBlog });
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
      const results = await db.update('blog', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }
  /**
   * @method delete - Deletes this blog
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  static async deleteBlog(idBlog) {
    let deletedRows;
    try {
      const results = await db.delete('blog', idBlog);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

}

Routine.table = 'blogs';
Routine.categoryBlogTable = 'blogs_categories';
Routine.exists = generic.exists(Blog.table);
module.exports = Blog;
