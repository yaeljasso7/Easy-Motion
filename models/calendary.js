const db = require('../db');
const Routine = require('./routine');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class Calendary{
  constructor({id, name,})
  {
    this.id=  id;
    this.name = name;
  }

  save(){
    db.new(this);
  }

   static async getCalendarys(){
     const data = await db.getAll('calendary');
     const response = [];
     data.forEach((row) => {
       response.push(new Calendary(row));
     });
     return response;
   }

   static async getCalendary(idCalendary) {
    const data = await db.get('calendary', idCalendary);
    if (data.length !== 0) {
      const calendary = new Calendary(data[0]); //Row > Objeto Calendary
      calendary.routinesPerDay = await Calendary.getRoutines(calendary.id);
      return calendary;
    }
    return data;
  }

  static async getRoutines(idCalendary) {
    const data = await db.select('calendaryDayRoutine', { idCalendary }); //Rows con id idUser idCalendary
    const response = [];
    //buscar las rutinas asociadas al usuario en la tabla rutinas
    const myPromises = data.map(async (row) => {
      const routine = await Routine.get(row.idRoutine, true);
      if (!response[row.day]) {
        response[row.day] = [];
      }
      response[row.day].push(routine);
    });
    await Promise.all(myPromises);
    return response;
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
    } catch (e) {
      throw e;
    }
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

  static async addRoutine(idCalendary, idRoutine , day) {
    let response;
    try {
      response = await db.insert('calendaryDayRoutine', { idCalendary, idRoutine, day });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idCalendary, idRoutine , day };
    }
   return [];
  }

  static async removeRoutine(idCalendary, idRoutine, day) {
    let response;
    try {
      response = await db.adv_delete('calendaryDayRoutine', { idCalendary, idRoutine, day });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }


}

module.exports = Calendary;
