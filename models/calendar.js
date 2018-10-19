const db = require('../db');
const Routine = require('./routine');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar
// los errores a traves de un try-catch

class Calendar {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  save() {
    db.new(this);
  }

  static async getCalendars(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select('calendar', { isDeleted: false }, [page * pageSize, pageSize]);
      data.forEach((row) => {
        response.push(new Calendar(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async getCalendar(id) {
    let data;
    try {
      data = await db.select('calendar', { id, isDeleted: false }, [1]);
      console.log(data);
      if (data.length !== 0) {
        const calendar = new Calendar(data[0]);
        calendar.routinesPerDay = await Calendar.getRoutines(calendar.id);
        return calendar;
      }
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new Calendar(data[0]) : [];
  }

  static async getRoutines(idCalendar) {
    const data = await db.select('calendarDayRoutine', { idCalendar, isDeleted: false }); // Rows con id idUser idCalendar
    const response = [];
    // buscar las rutinas asociadas al usuario en la tabla rutinas
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

  static async deleteCalendar(id) {
    let deletedRows;
    try {
      const results = await db.advUpdate('calendar', { isDeleted: true }, { id, isDeleted: false });
      deletedRows = results.affectedRows;
    } catch (e) {
      throw e;
    }

    return deletedRows > 0;
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

  static async addRoutine(idCalendar, idRoutine, day) {
    let response;
    try {
      response = await db.insert('calendarDayRoutine', { idCalendar, idRoutine, day });
    } catch (err) {
      throw err;
    }

    if (response.affectedRows > 0) {
      return { idCalendar, idRoutine, day };
    }
    return [];
  }

  static async removeRoutine(idCalendar, idRoutine, day) {
    let response;
    try {
      response = await db.advUpdate('calendarDayRoutine', { isDeleted: true }, {
        idCalendar,
        idRoutine,
        day,
        isDeleted: false,
      });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }
}
module.exports = Calendar;
