const mysql = require('mysql');
//const User = require('../models/user');

class DB{

  constructor(){
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

  query(){

  }

  getAll(table, callback){
      var json = '';
      this.con.query(`SELECT * FROM ${table}`, (err, rows, fields) =>{
      if(!err){
        callback(err, rows);
      }else {
        console.log(err);
      }
    });
  }

  get(table,id,callback){
    this.con.query(`SELECT * FROM ${table} WHERE id_User = ?`, [id] ,(err, rows, fields) =>{
      if(!err){
        callback(err, rows);
      }else {
        console.log(err);
      }
    });
  }



}

module.exports = new DB(); //singleton
