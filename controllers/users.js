//controladores users

//get all users
exports.getAllUsers = function(req, res){
  const users = [
    {
      id: 1,
      name: 'juana',
      email: 'juan@correo',
    },
    {
      id: 2,
      name: 'juan',
      email: 'juan@correo',
    },
  ]

  const json = {
    response: 'ok',
    data: users,
    total: 2
  }

  res.send(json);
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
