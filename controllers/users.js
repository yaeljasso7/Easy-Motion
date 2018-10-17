//controladores users
const { User } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class UserCtrl{
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

   async getAll(req, res){

     let data = await User.getUsers();

     // FIXME Este paginado no esta correcto
     const json = {
       data: data,
       total_count: data.length,
       per_page: data.length,
       page: 0,
     };

     // In case user was not found
     if (data.length === 0) {
       res.status(204);
     }

     res.send(json);
  }

  async get(req, res){
      let data = await User.getUser(req.params.idUser);
      console.log("ctl-get", data);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  async create(req, res, next){
    console.log("si se actualizo :D");
    try {
      const data = await User.createUser(req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next){
    let deleted;
    try {
      deleted = await User.deleteUser(req.params.idUser);
    } catch (error) {
      next(error);
    }

    if (deleted) {
      res.status(200); // OK
    } else {
      res.status(404); // Not Found
    }

    res.send();
  }

  async update(req, res, next) {

   const data = await User.getUser(req.params.idUser);

   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.updateUser(req.body);
     if (updated) {
       res.status(200); // OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     res.status(409);
     next(e);
   }
   console.log("r-body", req.body);
   console.log("data:",data);
   // FIXME ESto deberia regresar un objeto de tipo user idealmente o un objeto con un formato definido para respuestas
   res.send( Object.assign(data, req.body) ); // FIXME en lugar de usar assign puede hacer spread { ...data, ...req.body }
 }


 async addRoutine(req, res, next) {
   const { idUser } = req.params;
   const { idRoutine} = req.body;
   try {
    const data = await User.addRoutine(idUser, idRoutine);
    res.status(201).send(data);
    } catch (err) {
    next(err);
    }
   //res.send("jjojoj");
 }



}
module.exports = new UserCtrl();
