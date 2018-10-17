const db = require('../db');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class Calendary{
  constructor({id, name,})
  {
    this.id=  id;
    this.name = name;
  }

  save(){
    db.new(this);//table,this
  }

   static async getCalendarys(){
     const data = await db.getAll('calendary');
     const response = [];
     data.forEach((row) => {
       response.push(new Calendary(row));
     });
     console.log(response);
     return response;
   }

   static async getCalendary(idCalendary) {
    const data = await db.get('calendary', idCalendary);
    return data.length !== 0 ? new Calendary(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async deleteCalendary(idCalendary) {
    let deletedRows;
    try {
      const results = await db.delete('calendary', idCalendary);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async createCalendary({ name }) {

    let response;
    try {
      response = await db.insert('calendary', { name });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new Calendary({ id, name });
    }
    return [];
  }

  async updateCalendary(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('calendary', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = Calendary;
