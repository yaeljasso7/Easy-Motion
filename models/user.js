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

  static test(){
    console.log('jaja');
  }

  getUsers(){
    
   }

   getList(){

   }

}

module.exports = new User();
