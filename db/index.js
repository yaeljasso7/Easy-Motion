const mysql = require('mysql');
const User = require('../models/user');

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

  get(table){
      this.con.query('SELECT * FROM user', (err, rows, fields) =>{
      if(!err){
        return this.processResult(table, rows);
      }else {
        console.log(err);
      }
    });
  }

  processResult(table, rows){
//    console.log(rows[0]);

    rows.forEach((r) => {
      console.log(r.name_User);

  //    var usuar =  new User(r.id_User,r.name_User,r.mobile_User,r.weight_User,r.height_User,r.password_User,r.mail_User);
    // console.log(usuar);
      //var [] = new usuario(r);
    })
    /*
    result.forEach((r) => {
      new [table](r);
    })
    */
  }


}

module.exports = new DB(); //singleton
