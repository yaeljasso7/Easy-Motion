const db = require('../db');

class Blog{
  constructor({id, date, autor, data})
  {
    this.idBlog =  id;
    this.dateBlog = date;
    this.autorBlog = autor;
    this.dataBlog = data;

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
    return data.length !== 0 ? new Blog(data[0]) : data; //elemento 0 de rowDataPackege
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

  static async createBlog({ date, autor, data }) {

    let response;
    try {
      response = await db.insert('blog', { date, autor, data });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new Blog({ id, date, autor, data });
    }
    return [];
  }

  async updateBlog(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('blog', keyVals, this.idBlog);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = Blog;
