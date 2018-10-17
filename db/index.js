const mysql = require('mysql');

const First = 0;
const Zero = 0;
const One = 1;
// FIXME Falta documentacion en todos los metodos

class DB {
  constructor() {
    this.keywords = ['and', 'or'];
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

  where(qryCond) {
    const Default = '1';
    let sqry;
    const keys = Object.keys(qryCond);
    if (keys.length === Zero) {
      return Default;
    }
    if (keys.length > One) {
      const tmpQry = {};
      tmpQry[this.keywords[First]] = qryCond;
      return this.where(tmpQry);
    }
    const key = keys[First];
    const conds = [];
    if (this.keywords.includes(key.toLowerCase())) {
      Object.keys(qryCond[key]).forEach((cond) => {
        const tmpQry = {};
        tmpQry[cond] = qryCond[key][cond];
        conds.push(this.where(tmpQry));
      });
      sqry = conds.length > Zero ? conds.join(` ${key.toUpperCase()} `) : Default;
    } else {
      sqry = `${this.conn.escapeId(key)} = ${this.conn.escape(qryCond[key])}`;
    }
    return sqry;
  }

  limit(qryLimit) {
    if (qryLimit.length === 0) {
      return '';
    }
    return `LIMIT ${this.conn.escape(qryLimit)}`;
  }

  orderBy(qryOrder) {
    if (qryOrder.length === 0) {
      return '';
    }
    return `ORDER BY ${this.conn.escapeId(qryOrder)}`;
  }

  select(table, qryCond = {}, qryLimit = []) {
    return new Promise((resolve, reject) => {
      this.conn.query(`SELECT * FROM ??
        WHERE ${this.where(qryCond)} ${this.limit(qryLimit)}`,
      [table], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  // advanced delete
  advDelete(table, qryCond = {}) {
    return new Promise((resolve, reject) => {
      this.conn.query(`DELETE FROM ?? WHERE ${this.where(qryCond)}`, [table], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  // advanced update
  advUpdate(table, obj, qryCond = {}) {
    return new Promise((resolve, reject) => {
      this.conn.query(`UPDATE ?? SET ? WHERE ${this.where(qryCond)}`, [table, obj], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  getAll(table) {
    return new Promise((resolve, reject) => {
      this.conn.query('SELECT * FROM ??', [table], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  get(table, id) {
    return new Promise((resolve, reject) => {
      this.conn.query('SELECT * FROM ?? WHERE id = ?', [table, id], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  delete(table, id) {
    return new Promise((resolve, reject) => {
      this.conn.query('DELETE FROM ?? WHERE id = ?', [table, id], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  update(table, obj, id) {
    return new Promise((resolve, reject) => {
      this.conn.query('UPDATE ?? SET ? WHERE id = ?', [table, obj, id], (error, results) => {
        if (error) {
          return reject(this.processError(error));
        }
        return resolve(results);
      });
    });
  }

  insert(table, resource) {
    return new Promise((resolve, reject) => {
      this.conn.query('INSERT INTO ?? SET ?', [table, resource], (error, results) => {
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
          message: `El ${data.field} ${data.data} ya existe en el sistema`,
          field: data.field,
          sql: err.sql,
        };
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        error['La llave no existe'] = {
          message: `The ${err.sqlMessage} Existeee`,
          sql: err.sql,
        };
        break;

      default:
    }

    return error;
  }

  getDataFromErrorMsg(message) {
    this.void();
    const data = unescape(message).match(/'([^']+)'/g);
    return {
      field: data[1].slice(1, -1),
      data: data[First].slice(1, -1),
    };
  }
}

module.exports = new DB();
