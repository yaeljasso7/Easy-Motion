const mysql = require('mysql');

class DB{

  constructor(){
    this.con = mysql.createConnection({
      host: "db4free.net",
      user: "ichris96",
      password: "12345678",
      database: "easymotionsql"
    });

//    this.con.connect();
    this.con.connect((err) => {
      if(err){
        console.log("No se pudo conectar a la db");
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
