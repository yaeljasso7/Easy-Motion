const mysql = require('mysql');

class DB{

  constructor(){
    this.con = mysql.createConnection({
      host: 85.10.205.173:3306,
      user: ichris96,
      password: 12345678,
      database: easymotionsql
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
