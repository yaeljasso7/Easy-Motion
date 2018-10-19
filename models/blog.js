const db = require('../db');
const categoryBlog = require('./categoryBlog');
const bcrypt = require('bcrypt');
// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class Blog {
  constructor({id, date, autor, data, categoryBlog})
  {
    this.id =  id;
    this.date = date;
    this.autor = autor;
    this.data = data;
    this.categoryBlog = categoryBlog;

  }

  save(){
    db.new(this);
  }

   static async getBlogs(){
     const data = await db.getAll('blog');
     const response = [];
     data.forEach((row) => {
       response.push(new Blog(row));
     });
     return response;
   }

   static async getBlog(idBlog) {
    const data = await db.get('blog', idBlog);

    // FIXME En lugar de regresar el objeto de DB para vacio, debes construir tu propio objeto en el manejador de la base de datos
    //return data.length !== 0 ? new Blog(data[0]) : data; //elemento 0 de rowDataPackege
    if (data.length !== 0) {
      const blog = new Blog(data[0]); //Row > Objeto User
      blog.categorys = await Blog.getCategory(blog.categoryBlog);
      return blog;
    }
  }

  static async getCategory(idCategory) {
    const response = [];
    const category = await categoryBlog.getcategoryBlog(idCategory);
    response.push(category);
    return response;
  }

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

  async updateBlog(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('blog', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

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

module.exports = Blog;
