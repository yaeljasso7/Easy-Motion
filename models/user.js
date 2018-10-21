const db = require('../db');
const Calendar = require('./calendar');
const ProgressUser = require('./progressUser');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos
// deberian manejar los errores a traves de un try-catch

class User {
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

  save() {
    db.new(this);
  }

  static async getAll(page = 0, deletedItems) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    const cond = {};
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: 'users',
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

  static async get(id, deletedItems = false) {
    const cond = { id };
    if (!deletedItems) {
      cond.isDeleted = false;
    }
    try {
      const data = await db.select({
        from: 'users',
        where: cond,
        limit: 1,
      });
      if (data.length !== 0) {
        const user = new User(data[0]);
        user.calendars = await user.getCalendars();
        return user;
      }
    } catch (err) {
      throw err;
    }
    return [];
  }

  static async loginUser(mail, password) {
    const data = await db.select({
      from: 'users',
      where: {
        mail,
        password,
      },
      limit: 1,
    });
    return data.length !== 0 ? new User(data[0]) : [];
  }

  // Busca en la db userCalendar donde este el usuario
  async getCalendars(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select({
        from: 'users_calendars',
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

  static async create({
    name, mobile, weight, height, password, mail,
  }) {
    let response;
    try {
      response = await db.insert({
        into: 'users',
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

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate({
        table: 'users',
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

  async delete() {
    let deletedRows;
    try {
      const results = await db.advUpdate({
        table: 'users',
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

  async addCalendar({ calendarId }) {
    let response;
    try {
      response = await db.insert({
        into: 'users_calendars',
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

  async removeCalendar({ calendarId }) {
    let response;
    try {
      response = await db.advDelete({
        from: 'users_calendars',
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

  async getProgress(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select({
        from: 'users_progress',
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

  async addProgress({ weight, height }) {
    let response;
    try {
      response = await db.insert({
        into: 'users_progress',
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

module.exports = User;
