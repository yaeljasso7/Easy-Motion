//controladores users
const db = require('../db');
const User = require('../models/user');

class UserCtrl {
  constructor(){

    this.getAll = this.getAll.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getUser  = this.getUser.bind(this);
  }

  getAll(req, res){

    db.get("user", function (err, resultaditos){
      //console.log(resultaditos);
       var resultJson = JSON.stringify(resultaditos);
      // resultJson = JSON.parse(resultJson);
      // console.log(resultJson);
       res.send(resultJson);

    });


  }

  getUser(req, res){

  }

  createUser(req, res){

  }

  updateUser(req, res){

  }

  deleteUser(req, res){

  }
}
module.exports = new UserCtrl();
//get all users
