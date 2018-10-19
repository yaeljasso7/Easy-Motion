const mysql = require('mysql');
const Qry = require('./query');

// FIXME Falta documentacion en todos los metodos

class DB {
  constructor() {
    this.conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    this.conn.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Db Conect!');
      }
    });
  }

  select({
    cols, from, where, sorter, desc, limit,
  }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.select({
        cols, from, where, sorter, desc, limit,
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  // advanced delete
  advDelete({
    from, where, sorter, desc, limit,
  }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.delete({
        from, where, sorter, desc, limit,
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  // advanced update
  advUpdate({
    table, assign, where, sorter, desc, limit,
  }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.update({
        table, assign, where, sorter, desc, limit,
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  getAll(table) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.select({ from: table }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  get(table, id) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.select({ from: table, id }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  delete(table, id) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.delete({
        from: table,
        where: { id },
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  update(table, obj, id) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.update({
        table,
        assign: obj,
        where: { id },
      }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  insert({ into, resource }) {
    return new Promise((resolve, reject) => {
      this.conn.query(Qry.insert({ into, resource }), (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  processError(err) {
    const error = {};
    let data;
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        data = this.getDataFromErrorMsg(err.sqlMessage);
        error.duplicated = {
          message: `${data.field} with value ${data.data} already exists!`,
          field: data.field,
          sql: err.sql,
        };
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        data = this.getDataFromErrorMsg(err.sqlMessage);
        error.noReference = {
          message: `${data.field} with value ${data.data} doesn't exist!`,
          sql: err.sql,
        };
        break;
      default:
        error[err.code] = {
          message: err.sqlMessage,
          sql: err.sql,
        };
    }
    return error;
  }

  getDataFromErrorMsg(message) {
    this.void();
    const data = unescape(message).match(/'([^']+)'/g);
    return {
      field: data[1].slice(1, -1),
      data: data[0].slice(1, -1),
    };
  }
}

module.exports = new DB();
