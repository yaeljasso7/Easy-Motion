const db = require('../db');
const Routine = require('./routine');

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
    if (data.length !== 0) {
      const calendary = new Calendary(data[0]); //Row > Objeto Calendary
      calendary.routines = await Calendary.getRoutines(calendary.id);
      return calendary;
    }
    return data;
  }

  static async getRoutines(idCalendary) {
    const data = await db.select('calendaryDayRoutine', { idCalendary}); //Rows con id idUser idCalendary
    data.sort((a,b)=>a.day-b.day);
    const response = [];
    //buscar las rutinas asociadas al usuario en la tabla rutinas
    const myPromises = data.map(async (row) => {
      const routine = await Routine.get(row.idRoutine, true);
      routine.day = row.day;
      response.push(routine);
    });
    await Promise.all(myPromises); //si se cumplen todas las promesas
    console.log(response, "response");
    console.log(typeof(response));
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

  static async addRoutine(idCalendary, idRoutine , day) {
    let response;
    try {
      response = await db.insert('calendaryDayRoutine', { idCalendary, idRoutine, day});
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idCalendary, idRoutine , day};
    }
   return [];
  }

  static async removeRoutine(idCalendary, idRoutine, day) {
    let response;
    try {
      response = await db.adv_delete('calendaryDayRoutine', { idCalendary, idRoutine, day});
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idCalendary , idRoutine, day };
    }
    //return [];
  }


}

module.exports = Calendary;
