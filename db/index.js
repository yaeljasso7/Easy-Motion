const mysql = require('mysql');

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

}

module.exports = new DB(); //singleton
