const db = require('../db');

class User{
  constructor(...arg){
    this.id_User = id_User;
    this.name_User = name_User;
    this.mobile_User = mobile_User;
    this.weight_User = weight_User;
    this.height_User = height_User;
    this.password_User = password_User;
    this.mail_User = mail_User;
  }

  save(){
    db.new(this);
  }

  test(){
    console.log('jaja');
  }
}

module.exports = User;
