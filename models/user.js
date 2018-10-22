const db = require('../db');
const Calendar = require('./calendar');
const ProgressUser = require('./progressUser');
const generic = require('./generic');

/**
 * @class User
 * Represents an User
 */
class User {
  /**
   * Routine constructor
   * @param {Number} id            - The user id
   * @param {String} name          - The user name
   * @param {String} mobile          - The user mobile
   * @param {Number} weight          - The user weight
   * @param {Number} height          - The user height
   * @param {String} password          - The user name
   * @param {Number} mail        - The user mail
   */
  constructor({
    id, name, mobile, weight, height, password, mail,
  }) {
    this.id = id;
    this.name = name;
    this.mobile = mobile;
    this.weight = weight;
    this.height = height;
    this.password = password;
    this.mail = mail;
  }

  /**
   * @method getAll - Retrieve all the users from a page
   *
   * @param  {Number}  [page=0]             - The page to retrieve the users
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents, the users from that page
   */
  static async getAll(page = 0, deletedItems) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: User.table,
        where: cond,
        limit: [page * pageSize, pageSize],
      });
      data.forEach((row) => {
        response.push(new User({ ...row, password: undefined }));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @method get - Retrieve a user, based on their id
   *
   * @param  {Number}  id - The user identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents a user
   */
  static async get(id, deletedItems = false) {
    const cond = { id };
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: User.table,
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        const user = new User(data[0]);
        user.permissions = await User.getPermissions(data[0].role);
        // user.calendars = await user.getCalendars();
        return user;
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async getPermissions(role) {
    const response = [];
    try {
      const data = await db.select({
        columns: 'permissions.name',
        from: 'roles_permissions',
        join: {
          table: 'permissions',
          on: {
            'roles_permissions.permissionId': 'permissions.id',
          },
        },
        where: {
          'roles_permissions.roleId': role,
        },
      });
      data.forEach((row) => {
        response.push(row.name);
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @method get - Retrieve a user, based on their mail
   *
   * @param  {Number}  id - The user identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} - Promise Object represents a user
   */
  static async loginUser(mail) {
    const data = await db.select({
      from: User.table,
      where: {
        mail,
      },
      limit: 1,
    });
    return data.length !== 0 ? new User(data[0]) : [];
  }

  /**
   * @method get - Retrieve a calendar assigned to the user
   * @return {Promise} - Promise Object represents the calendars
   */
  async getCalendars(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select({
        from: User.calendarTable,
        where: {
          userId: this.id,
        },
        limit: [page * pageSize, pageSize],
      });
      const myPromises = data.map(async (row) => {
        const calendar = await Calendar.get(row.calendarId, true);
        response.push(calendar);
      });
      await Promise.all(myPromises); // si se cumplen todas las promesas
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @method create - Inserts a user into the database
   * @param {Number} id            - The user id
   * @param {String} name          - The user name
   * @param {String} mobile          - The user mobile
   * @param {Number} weight          - The user weight
   * @param {Number} height          - The user height
   * @param {String} password          - The user name
   * @param {Number} mail        - The user mail
   */
  static async create({
    name, mobile, weight, height, password, mail,
  }) {
    let response;
    try {
      response = await db.insert({
        into: User.table,
        resource: {
          name, mobile, weight, height, password, mail,
        },
      });
      const id = response.insertId;
      if (id > 0) {
        const user = new User({
          id, name, mobile, weight, height, password, mail,
        });
        await user.addProgress({ weight, height });
        return user;
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  /**
   * @method update - Modifies fields from this user.
   *
   * @param  {Object}  keyVals - Represents the new values for this user.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: User.table,
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
   * @method delete - Deletes this user.
   *                  Assigns true to isDeleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: User.table,
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
   * @method addCalendar - Adds a calendar to this user
   * @param  {Number}  calendarId  - The calendar id to be added
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async addCalendar({ calendarId }) {
    let response;
    try {
      response = await db.insert({
        into: User.calendarTable,
        resource: {
          userId: this.id,
          calendarId,
        },
      });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }
  /**
   * @method removeCalendar- Removes an calendar from this user
   *
   * @param  {Number}  calendarId - The calendar id
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */

  async removeCalendar({ calendarId }) {
    let response;
    try {
      response = await db.advDelete({
        from: User.calendarTable,
        where: {
          userId: this.id,
          calendarId,
        },
        limit: 1,
      });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }

  /**
   * @method getProgress- Retrieve all the progress of this user
   * @return {Promise} - Promise Object represents the exercises of this user
   */
  async getProgress(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select({
        from: User.progressTable,
        where: {
          userId: this.id,
        },
        limit: [page * pageSize, pageSize],
      });
      data.forEach((row) => {
        response.push(new ProgressUser(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @method addProgress - Adds an progress to this user
   * @param  {Number}  weight  - The weight to be added
   * @param  {Number}  height  - The height to be added
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async addProgress({ weight, height }) {
    let response;
    try {
      response = await db.insert({
        into: User.progressTable,
        resource: {
          userId: this.id,
          weight,
          height,
        },
      });
    } catch (err) {
      throw err;
    }

    return response.affectedRows > 0;
  }
}

User.table = 'users';
User.progressTable = 'users_progress';
User.calendarTable = 'users_calendars';
User.exists = generic.exists(User.table);

module.exports = User;
