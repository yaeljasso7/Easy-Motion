//controladores users
const db = require('../db');
//get all users
exports.getAllUsers = function(req, res){
  console.log('jeje');
  this.users = db.get('user');
  const json={
    response: 'ok',
    data: this.users,
  };
  res.send(json);
  /*
  db.con.query('SELECT * FROM user', (err, rows, fields) =>{
    if(!err){
      console.log(rows);
      res.json(rows);
    }else {
      console.log(err);
    }
  });
  */

}

exports.getOneUser = function (req, res) {
  const user = {
    id: req.params.id,
    name: `usuario${req.params.id}`,
    email: `usuario${req.params.id}@correo`,
  }
  res.send(user);
}

exports.createOneUser =  function (req, res) {
  const json = {
    response: 'ok',
    data: {
      id: 100,
      name: req.body.name,
      mail: req.body.mail,
      password: req.body.password,
    }
  }
  res.send(json);
}

exports.updateOneUser = function (req, res) {
  res.send('editado');
}

exports.deleteOneUser = function (req, res) {

  res.send('eliminado');
}
