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

    User.getUsers( (err, users) => {
        console.log(users);
        res.send(users);
    });

    /*
    db.get("user", function (err, resultaditos){
      //console.log(resultaditos);
       var resultJson = JSON.stringify(resultaditos);
      // resultJson = JSON.parse(resultJson);
      // console.log(resultJson);
       res.send(resultJson);

    });
    */
    //res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
    //res.send([]);
  }

  getUser(req, res){
    const {id} = req.params;
    User.getUser( id ,(err, users) => {
        console.log(users);
        res.send(users);
    });
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
