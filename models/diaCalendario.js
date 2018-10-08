const db = require('../db');

class diaCalendario{
  constructor({id})
  {
    this.iddiaCalendario =  id;
  }

  save(){
    db.new(this);//table,this
  }

   static async getDias(){
     const data = await db.getAll('diaCalendario');
     const response = [];
     data.forEach((row) => {
       response.push(new diaCalendario(row));
     });
     console.log(response);
     return response;
   }

   static async getdiaCalendario(iddiaCalendario) {
    const data = await db.get('diaCalendario', iddiaCalendario);
    return data.length !== 0 ? new diaCalendario(data[0]) : data; //elemento 0 de rowDataPackege
  }

  static async deletediaCalendario(iddiaCalendario) {
    let deletedRows;
    try {
      const results = await db.delete('diaCalendario', iddiaCalendario);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async creatediaCalendario({ name, mobile, weight, height, password, mail }) {

    let response;
    try {
      response = await db.insert('diaCalendario', { name, mobile, weight, height, password, mail });
      console.log("soy response:", response);
    } catch (e) {
      //error de la db
      throw e;
    }
    //si no hay error
    const id = response.insertId;
    if (id > 0) {
      return new diaCalendario({ id, name, mobile, weight, height, password, mail });
    }
    return [];
  }

  async updatediaCalendario(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('diaCalendario', keyVals, this.iddiaCalendario);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

}

module.exports = diaCalendario;
