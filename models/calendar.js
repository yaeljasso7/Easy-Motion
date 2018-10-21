const db = require('../db');
const Routine = require('./routine');
const generic = require('./generic');

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

  static async getAll(page = 0, deletedItems = false) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Calendar.table,
        where: cond,
        limit: [page * pageSize, pageSize],
      });
      data.forEach((row) => {
        response.push(new Calendar(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async get(id, deletedItems = false) {
    const cond = { id };
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Calendar.table,
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        const calendar = new Calendar(data[0]);
        calendar.routinesPerDay = await calendar.getRoutines();
        return calendar;
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  async getRoutines() {
    const response = [];
    try {
      const data = await db.select({
        from: Calendar.routineDayTable,
        where: {
          calendarId: this.id,
        },
      });
      const myPromises = data.map(async (row) => {
        const routine = await Routine.get(row.routineId, true);
        if (!response[row.day]) {
          response[row.day] = [];
        }
        response[row.day].push(routine);
      });
      await Promise.all(myPromises);
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async create({ name }) {
    let response;
    try {
      response = await db.insert({
        into: Calendar.table,
        resource: { name },
      });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new Calendar({ id, name });
    }
    return [];
  }

  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: Calendar.table,
        assign: {
          isDeleted: true,
        },
        where: {
          id: this.id,
          isDeleted: false,
        },
        limit: 1,
      });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return deletedRows > 0;
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: Calendar.table,
        assign: keyVals,
        where: {
          id: this.id,
        },
        limit: 1,
      });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }

  async addRoutine({ routineId, day }) {
    let response;
    try {
      response = await db.insert({
        into: Calendar.routineDayTable,
        resource: {
          calendarId: this.id,
          routineId,
          day,
        },
      });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }

  async removeRoutine({ routineId, day }) {
    let deletedRows;
    try {
      const results = await db.advDelete({
        from: Calendar.routineDayTable,
        where: {
          calendarId: this.id,
          routineId,
          day,
        },
        limit: 1,
      });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }

    return deletedRows > 0;
  }
}

Calendar.table = 'calendars';
Calendar.routineDayTable = 'routines_calendars';
Calendar.exists = generic.exists(Calendar.table);

module.exports = Calendar;
