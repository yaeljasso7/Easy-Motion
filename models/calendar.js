const db = require('../db');
const Routine = require('./routine');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class Calendar{
  constructor({id, name,})
  {
    this.id=  id;
    this.name = name;
  }

  save(){
    db.new(this);
  }

   static async getCalendars(){
     const data = await db.getAll('calendar');
     const response = [];
     data.forEach((row) => {
       response.push(new Calendar(row));
     });
     return response;
   }

   static async getCalendar(idCalendar) {
    const data = await db.get('calendar', idCalendar);
    if (data.length !== 0) {
      const calendar = new Calendar(data[0]); //Row > Objeto Calendar
      calendar.routinesPerDay = await Calendar.getRoutines(calendar.id);
      return calendar;
    }
    return data;
  }

  static async getRoutines(idCalendar) {
    const data = await db.select('calendarDayRoutine', { idCalendar }); //Rows con id idUser idCalendar
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

  static async deleteCalendar(idCalendar) {
    let deletedRows;
    try {
      const results = await db.delete('calendar', idCalendar);
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
  }

  static async createCalendar({ name }) {

    let response;
    try {
      response = await db.insert('calendar', { name });
    } catch (e) {
      throw e;
    }
    const id = response.insertId;
    if (id > 0) {
      return new Calendar({ id, name });
    }
    return [];
  }

  async updateCalendar(keyVals) {
    let updatedRows;
    try {
      const results = await db.update('calendar', keyVals, this.id);
      updatedRows = results.affectedRows;
    } catch (error) {
      throw error;
    }
    return updatedRows > 0;
  }

  static async addRoutine(idCalendar, idRoutine , day) {
    let response;
    try {
      response = await db.insert('calendarDayRoutine', { idCalendar, idRoutine, day });
    } catch (err) {
      throw err;
    }

    const id = response.insertId;
    if (response.affectedRows > 0) {
      return { idCalendar, idRoutine , day };
    }
   return [];
  }

  static async removeRoutine(idCalendar, idRoutine, day) {
    let response;
    try {
      response = await db.adv_delete('calendarDayRoutine', { idCalendar, idRoutine, day });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }


}

module.exports = Calendar;
