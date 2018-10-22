const db = require('../db');
const Routine = require('./routine');
const generic = require('./generic');

/**
 * @class Calendar
 * Represents a calendar of routines
 */

class Calendar {
  /**
   * Routine constructor
   * @param {Number} id            - The calendar id
   * @param {String} name          - The calendar name
   */
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  save() {
    db.new(this);
  }

  /**
   * @method getAll - Retrieve all the calendars from a page
   *
   * @param  {Number}  [page=0]             - The page to retrieve the calendars
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents, the calendars from that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }, deletedItems = false) {
    const pageSize = Number(process.env.PAGE_SIZE);
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: Calendar.table,
        where: { ...filters, ...cond },
        sorter,
        desc,
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

  /**
   * @method get - Retrieve a calendar and its routines, based on their id
   *
   * @param  {Number}  id - The calendar identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents a calendar
   */
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

  /**
   * @method get - Retrieve a routines of calendars
   * @return {Promise} - Promise Object represents the routines
   */
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

  /**
   * @method create - Inserts a calendar into database
   *
   * @param {String} name - The rcalendar name
   */
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

  /**
   * @method delete - Deletes this calendar
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method update - Modifies fields from this calendar
   *
   * @param  {Object}  keyVals - Represents the new values for this calendar.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method addRoutine Adds an routine to this calendar
   * @param  {Number}  routineId  - The routine id to be added
   * @param  {Number}  day - The day where the routine must be done
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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

  /**
   * @method removeRoutine - Removes an routine from this calendar
   *
   * @param  {Number}  routineId - The routine id
   * @param  {Number}  day - The day
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
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
/**
 * Database table which rotuine are located
 * @type {String}
 */
Calendar.table = 'calendars';
/**
 * Database table which routines, for each calendar, are located
 * @type {String}
 */
Calendar.routineDayTable = 'routines_calendars';
/**
 * Checks if a calendar exists in the database, based on its id
 * @type {[type]}
 */
Calendar.exists = generic.exists(Calendar.table);
Calendar.ValidFilters = {
  name: 'asString',
};

module.exports = Calendar;
