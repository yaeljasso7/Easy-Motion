const mysql = require('mysql');
//const User = require('../models/user');

class DB {

  constructor(){
    this.keywords = ['and', 'or'];
    this.con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

//    this.con.connect();
    this.con.connect((err) => {
      if(err){
        console.log(err);
      }else{
        console.log('Db Conect!');
      }
    });
  }

  where(qryCond) {
    const Default = '1';
    let sqry;
    const keys = Object.keys(qryCond);
    if (keys.length === 0) return Default; // si no hay keys regresa valor por defecto
    if (keys.length > 1) { // si n_keys > 1 utiliza AND como valor por defecto
      const tmp = {};
      tmp[this.keywords[0]] = qryCond;
      return this.where(tmp);
    }
    const key = keys[0]; // sólo 1 key? procesa cada hijo
    const conds = [];
    if (this.keywords.includes(key.toLowerCase())) {
      Object.keys(qryCond[key]).forEach((cond) => { // itera sobre cada hijo
        const tmp = {};
        tmp[cond] = qryCond[key][cond];
        conds.push(this.where(tmp));
      });
      sqry = conds.length > 0 ? conds.join(` ${key.toUpperCase()} `) : Default;
    } else {
      sqry = `${this.con.escapeId(key)} = ${this.con.escape(qryCond[key])}`;
    }
    return sqry;
  }

  select(table, qryCond = {}) {
    return new Promise((resolve, reject) => {
      this.con.query(`SELECT * FROM ?? WHERE ${this.where(qryCond)}`, [table], (error, results) => {
        if (error) return reject(this.processError(error));
        return resolve(results);
      });
    });
  }

  // advanced delete
  adv_delete(table, qryCond = {}) { // sin condición borra todo
    return new Promise((resolve, reject) => {
      this.con.query(`DELETE FROM ?? WHERE ${this.where(qryCond)}`, [table], (error, results) => {
        if (error) return reject(this.processError(error));
        return resolve(results);
      });
    });
  }

  adv_update(table, obj, qryCond = {}) {
    return new Promise((resolve, reject) => {
      this.con.query(`UPDATE ?? SET ? WHERE ${this.where(qryCond)}`, [table, obj], (error, results) => {
        if (error) return reject(this.processError(error));
        return resolve(results);
      });
    });
  }

  getAll(table) {
    return new Promise((resolve, reject) => {
      this.con.query('SELECT * FROM ??', [table], (error, results) => {
        if (error) return reject(this.processError(error));
        return resolve(results);
      });
    });
  }

  get(table, id) {
    return new Promise((resolve, reject) => {
      this.con.query('SELECT * FROM ?? WHERE id = ?', [table, id], (error, results) => {
        if (error) return reject(this.processError(error));
        console.log("db-get",results);
        return resolve(results);
      });
    });
  }

  delete(table, id) {
    return new Promise((resolve, reject) => {
      this.con.query('DELETE FROM ?? WHERE id = ?', [table, id], (error, results) => {
        if (error) {
            //error de la base de datos como mail repetido...
          let err = this.processError(error);
          return reject(err);
        }

        //console.log("db-delete",results);
        return resolve(results);
      });
    });
  }

  update(table, obj, id) {
    return new Promise((resolve, reject) => {
      this.con.query('UPDATE ?? SET ? WHERE id = ?', [table, obj, id], (error, results) => {
        if (error) {
          console.log("el famoso:",error);
          let err = this.processError(error);
          return reject(err);
        }
        //console.log("rows--update", results);
        resolve(results);
      //  console.log(results);
      });
    });
  }

  insert(table, resource) {
    //console.log("Resourse Db Insert: ",resource); //{ name: juan, mobile: 21421, }
    return new Promise((resolve, reject) => {
      this.con.query('INSERT INTO ?? SET ?', [table, resource], (error, results) => {
        if (error) {
            //error de la base de datos como mail repetido...
        //console.log("Insert DB Error: ", error);
          let err = this.processError(error);
          return reject(err);
        }
        return resolve(results);
      });
    });
  }

  processError(err) {
    //console.log("soy error");
    const error = {};
    console.log("soy error", err);
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        let data = this.getDataFromErrorMsg(err.sqlMessage);
        error['duplicated'] = {
          message: `El ${data.field} ${data.data} ya existe en el sistema`,
          field: data.field,
          sql: err.sql,
        };
        break;
        case 'ER_NO_REFERENCED_ROW_2':
          error['La llave foranea no existe'] = {
            message: `The ${err.sqlMessage} Existeee`,
            sql: err.sql,
          };
        break;

      default:

    }

    return error;
  }

  getDataFromErrorMsg(message) {
    let data = unescape(message).match(/'([^']+)'/g);
    return {
      field: data[1].slice(1,-1),
      data: data[0].slice(1,-1),
    }
  }



}

module.exports = new DB(); //singleton
