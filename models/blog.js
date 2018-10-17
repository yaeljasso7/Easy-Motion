const db = require('../db');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class Blog{
  constructor({id, date, autor, data, categoryBlog})
  {
    this.id =  id;
    this.date = date;
    this.autor = autor;
    this.data = data;
    this.category= categoryBlog;

  }

  save(){
    db.new(this);//table,this
  }

   static async getBlogs(){
     const data = await db.getAll('blog');
     const response = [];
     data.forEach((row) => {
       response.push(new Blog(row));
     });
     console.log(response);
     return response;
   }

   static async getBlog(idBlog) {
    const data = await db.get('blog', idBlog);
    // FIXME En lugar de regresar el objeto de DB para vacio, debes construir tu propio objeto en el manejador de la base de datos
    return data.length !== 0 ? new Blog(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async createBlog({ date, autor, data, categoryBlog}) {
    let response;
    try {
      response = await db.insert('blog', { date, autor, data, categoryBlog });
    //  console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
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
