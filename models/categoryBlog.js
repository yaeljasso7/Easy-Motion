const db = require('../db');

class categoryBlog{
  constructor({id, name})
  {
    this.id =  id;
    this.name= name;
  }

  save(){
    db.new(this);//table,this
  }

   static async getcategoryBlogs(){
     const data = await db.getAll('categoryBlog');
     const response = [];
     data.forEach((row) => {
       response.push(new categoryBlog(row));
     });
     console.log(response);
     return response;
   }

   static async getcategoryBlog(idcategoryBlog) {
    const data = await db.get('categoryBlog', idcategoryBlog);
    return data.length !== 0 ? new categoryBlog(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async deletecategoryBlog(idcategoryBlog) {
    let deletedRows;
    try {
      const results = await db.delete('categoryBlog', idcategoryBlog);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async createcategoryBlog({ name }) {

    let response;
    try {
      response = await db.insert('categoryBlog', { name });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new categoryBlog({ id, name});
    }
    return [];
  }

  async updatecategoryBlog(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('categoryBlog', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = categoryBlog;
