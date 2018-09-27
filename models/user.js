const db = require('../db');

class User{
  constructor(...arg){
    this.id_User =  1;
    this.name_User = 2;
    this.mobile_User = 3;
    this.weight_User = 4;
    this.height_User = 5;
    this.password_User = 6;
    this.mail_User = 7;
  }

  save(){
    db.new(this);//table,this
  }

  getUsers(callback){
    db.getAll("user", function (err, resultados){
       var resultJson = JSON.stringify(resultados); //recoge rows
       callback(err, resultJson); //envia json
      // resultJson = JSON.parse(resultJson);
      //   console.log(resultJson);
    });
   }

   getUser(id, callback){
     db.get("user",id, (err, resultado) => {
       var resultJson = JSON.stringify(resultado);
       callback(err, resultJson);
     });
   }



}

module.exports = new User();
