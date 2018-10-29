const db = require('../db');
const Routine = require('./routine');
const generic = require('./generic');

/**
 * @class Calendar
 * Represents a calendar of routines
 */
class Calendar {
  /**
   * @constructor
   * @param {Number} id            - The calendar id
   * @param {String} name          - The calendar name
   */
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  /**
   * Database table which rotuine are located
   * @type {String}
   */
  static get table() {
    return 'calendars';
  }

  /**
   * Database table which routines, for each calendar, are located
   * @type {String}
   */
  static get routineDayTable() {
    return 'routines_calendars';
  }

  /**
   * The Calendar valid filters
   * @type {String}
   */
  static get ValidFilters() {
    return {
      name: 'asString',
    };
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the calendars from a page
   *
   * @param  {Number}  page - The page to retrieve the body parts
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} [Array] - Promise Object represents, the calendars from
   *         that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }, deletedItems = false) {
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
        limit: db.pageLimit(page),
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
   * @static @async
   * @method get - Retrieve a calendar and its routines, based on their id
   *
   * @param  {Number}  id - The calendar identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} [Calendar] - Promise Object represents a calendar
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
   * @async
   * @method get - Retrieve a routines of calendars
   *
   * @return {Promise} [Array] - Promise Object represents the routines
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
   * @static @async
   * @method create - Inserts a calendar into database
   *
   * @param  {String}   name - The rcalendar name
   * @return {Promise}  [Calendar] - Promise object, represents the calendar created
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
    return id > 0 ? new Calendar({ id, name }) : [];
  }

  /**
   * @async
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
   * @async
   * @method update - Modifies fields from this calendar
   *
   * @param  {Object}  keyVals - Represents the new values for this calendar.
   * @return {Promise} [Boolean] - Promise Object, represents the operation success
   */
  async update({ name }) {
    const keyVals = generic.removeEmptyValues({ name });
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
   * @async
   * @method addRoutine Adds an routine to this calendar
   *
   * @param  {Number}  routineId  - The routine id to be added
   * @param  {Number}  day - The day where the routine must be done
   * @return {Promise} [Boolean] - Promise Object represents the operation success
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
   * @async
   * @method removeRoutine - Removes an routine from this calendar
   *
   * @param  {Number}  routineId - The routine id
   * @param  {Number}  day - The day
   * @return {Promise} [Boolean] - Promise Object represents the operation success
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
 * Checks if a calendar exists in the database, based on its id
 * @type {asyncFunction}
 */
Calendar.exists = generic.exists(Calendar.table);

module.exports = Calendar;
