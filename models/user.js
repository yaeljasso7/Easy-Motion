const bcrypt = require('bcrypt');
const db = require('../db');
const Calendar = require('./calendar');
const ProgressUser = require('./progressUser');
const generic = require('./generic');

/**
 * @class User
 * Represents a User
 */
class User {
  /**
   * @constructor
   * @param {Number} id          - The user id
   * @param {String} name        - The user name
   * @param {String} mobile      - The user mobile
   * @param {Number} weight      - The user weight
   * @param {Number} height      - The user height
   * @param {String} password    - The user name
   * @param {Number} email       - The user email
   */
  constructor({
    id, name, mobile, weight, height, password, email, confirmed,
  }) {
    this.id = id;
    this.name = name;
    this.mobile = mobile;
    this.weight = weight;
    this.height = height;
    this.password = password;
    this.email = email;
    this.confirmed = confirmed;
  }

  /**
   * Database table which users are located
   * @type {String}
   */
  static get table() {
    return 'users';
  }

  /**
   * Database table which progress, followed by users, are located
   * @type {String}
   */
  static get calendarTable() {
    return 'users_calendars';
  }

  /**
   * Database table which users progress, are located
   * @type {String}
   */
  static get progressTable() {
    return 'users_progress';
  }

  /**
   * The Users valid filters
   * @type {Object}
   */
  static get ValidFilters() {
    return {
      email: 'asString',
      role: 'asNumber',
      name: 'asString',
    };
  }

  /**
   * SaltRounds used to hash the password
   * @type {Number}
   */
  static get saltRounds() {
    return Number(process.env.SALT);
  }

  /**
   * @method mask - Hide attributes.
   * @param  {(String|String[])}  fileds - Attributes to hide.
   * @return {Object} [User] - This user, with masked attributes.
   */
  mask(fields) {
    const properties = fields.constructor === Array ? fields : [fields];
    properties.forEach((attr) => {
      if (attr in this) {
        this[attr] = undefined;
      }
    });
    return this;
  }

  /**
   * @static @async
   * @method getAll - Retrieve all the users from a page
   *
   * @param  {Number}  page - The page to retrieve the users
   * @param  {String}  sorter - The sorter criteria
   * @param  {Boolean} desc - Whether the sort order is descendent
   * @param  {Object}  filters - The filters to be applied while getting all
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} [Array] - Promise Object represents, the users from that page
   */
  static async getAll({
    page, sorter, desc, filters,
  }, deletedItems = false) {
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.deleted = false;
    }
    try {
      const data = await db.select({
        from: User.table,
        where: { ...filters, ...cond },
        sorter,
        desc,
        limit: db.pageLimit(page),
      });
      data.forEach((row) => {
        response.push((new User(row)).mask('password'));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @static @async
   * @method get - Retrieve a user, based on its id
   *
   * @param  {Number}  id - The user identifier
   * @param  {Boolean} [deletedItems=false] - Include deleted items in the result?
   * @return {Promise} [User] - Promise Object represents a user
   */
  static async get(id, deletedItems = false) {
    const cond = { id };
    if (!deletedItems) {
      cond.deleted = false;
    }
    try {
      const data = await db.select({
        from: User.table,
        join: {
          table: User.progressTable,
          on: {
            id: `${User.progressTable}.userId`,
          },
        },
        sorter: `${User.progressTable}.date`,
        desc: true,
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        const user = new User(data[0]);
        user.permissions = await User.getPermissions(data[0].role);
        return user.mask('password');
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  /**
   * @static @async
   * @method getByEmail Retrieve a user based on its email
   *
   * @param  {String}  email The user email
   * @return {Promise} [User] - The user whom the email belongs
   */
  static async getByEmail(email) {
    try {
      const userData = await db.select({
        from: User.table,
        where: {
          email,
        },
        limit: 1,
      });
      if (userData.length !== 0) {
        return new User(userData[0]);
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  /**
   * @static @async
   * @method getPermissions - Get all permissions for a user role
   *
   * @param  {Number}  role - Represents the user role
   * @return {Promise} [Object] - Promise Object represents the role permissions
   */
  static async getPermissions(role) {
    const response = {};
    try {
      const data = await db.select({
        columns: ['name', 'cond'],
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
        response[row.name] = row.cond;
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  /**
   * @method login - Retrieve the user that match eemail & password
   *
   * @param  {String}   email - Mail to match with the user
   * @param  {String}   password - Password to match with the user
   * @return {Promise} - Promise Object represents a user
   */
  static async login(email, password) {
    try {
      const user = await User.getByEmail(email);
      if (user.length !== 0) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return user;
        }
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  /**
   * @async
   * @method getCalendars - Retrieve the calendars assigned to the user
   *
   * @return {Promise} - Promise Object represents the calendars
   */
  async getCalendars({
    page, sorter, desc, filters,
  }) {
    const response = [];
    try {
      const data = await db.select({
        from: User.calendarTable,
        join: {
          table: Calendar.table,
          on: {
            calendarId: `${Calendar.table}.id`,
          },
        },
        where: {
          ...filters,
          userId: this.id,
        },
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
   * @method create - Inserts a user into the database
   *
   * @param {Number} id          - The user id
   * @param {String} name        - The user name
   * @param {String} mobile      - The user mobile
   * @param {Number} weight      - The user weight
   * @param {Number} height      - The user height
   * @param {String} password    - The user name
   * @param {Number} email        - The user email
   */
  static async create({
    name, mobile, weight, height, password, email,
  }) {
    let response;
    try {
      response = await db.insert({
        into: User.table,
        resource: {
          name,
          mobile,
          password: await User.hashPassword(password),
          email,
        },
      });
      const id = response.insertId;
      if (id > 0) {
        const user = new User({
          id, name, mobile, email,
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
   * @async
   * @method update - Modifies fields from this user.
   *         If the email is modified, set confirmed to false
   *
   * @param  {Object}  keyVals - Represents the new values for this user.
   * @return {Promise} [Boolean] - Promise Object represents the operation success
   */
  async update({
    name, mobile, email, password,
  }) {
    const keyVals = generic.removeEmptyValues({
      name, mobile, email, password,
    });
    let updatedRows;
    if (keyVals.email) {
      keyVals.confirmed = false;
    }
    try {
      if (keyVals.password) {
        keyVals.password = await User.hashPassword(password);
      }
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
   * @async
   * @method confirm - Confirms the user email
   *
   * @return {Promise} [Boolean] - Promise object, represents the operation success
   */
  async confirm() {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: User.table,
        assign: { confirmed: true },
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
   * @static @async
   * @method hashPassword - Returns a password hashed
   * @param  {String}  password - The password to hash
   * @return {Promise} [String] - Promise object, represents the password hashed
   */
  static async hashPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, User.saltRounds);
      return hashedPassword;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @async
   * @method delete - Deletes this user.
   *         Assigns true to deleted, in the database.
   * @return {Promise} - Promise Object represents the operation success (boolean)
   */
  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: User.table,
        assign: {
          deleted: true,
        },
        where: {
          id: this.id,
          deleted: false,
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
   * @method addCalendar - Adds a calendar to this user
   *
   * @param  {Number}  calendarId  - The calendar id to be added
   * @return {Promise} [Boolean] - Promise Object represents the operation success
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
   * @async
   * @method removeCalendar - Removes a calendar from this user
   *
   * @param  {Number}  calendarId - The calendar id
   * @return {Promise} [Boolean] - Promise Object represents the operation success
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
   * @async
   * @method getProgress - Retrieve all the progress of this user
   *
   * @return {Promise} [Array] - Promise Object represents the progress of this user
   */
  async getProgress({
    page, sorter, desc, filters,
  }) {
    const response = [];
    try {
      const data = await db.select({
        from: User.progressTable,
        where: {
          ...filters,
          userId: this.id,
        },
        sorter,
        desc,
        limit: db.pageLimit(page),
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
   * @async
   * @method addProgress - Adds a progress to this user
   *
   * @param  {Number}  weight  - The weight to be added
   * @param  {Number}  height  - The height to be added
   * @return {Promise} [Boolean] - Promise Object represents the operation success
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
      this.height = height;
      this.weight = weight;
    } catch (err) {
      throw err;
    }
    return response.affectedRows > 0;
  }

  /**
   * @method canDo - Verifies whether the user can do a specific task
   *
   * @param  {String} permission - The permission name
   * @return {Boolean} - Returns if the permission exists in the user permissions object
   */
  canDo(permission) {
    return Object.keys(this.permissions).includes(permission);
  }
}

User.exists = generic.exists(User.table);

module.exports = User;
