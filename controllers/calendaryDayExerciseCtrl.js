//controladores calendaryDayExercise
const { calendaryDayExercise } = require('../models');

class calendaryDayExerciseCtrl{
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

   async getAll(req, res){

     let data = await calendaryDayExercise.getcalendaryDayExercises();

     const json = {
       data: data,
       total_count: data.length,
       per_page: data.length,
       page: 0,
     };

     // In case calendaryDayExercise was not found
     if (data.length === 0) {
       res.status(204);
     }

     res.send(json);
  }

  async get(req, res){
      let data = await calendaryDayExercise.getcalendaryDayExercise(req.params.idcalendaryDayExercise);
      console.log("ctl-get", data);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  async create(req, res, next){
    try {
      let data = await calendaryDayExercise.createcalendaryDayExercise(req.body); //req.body {}
      console.log("ctrl-create",data);
      res.status(201).send(data);
    } catch (e) {
      //db error
      console.log("eee:" ,e);
      res.status (409).send("Error al insertar: " + e.duplicated.message);
      next(e);
    }
  }

  async delete(req, res, next){
    const deleted = await calendaryDayExercise.deletecalendaryDayExercise(req.params.idcalendaryDayExercise);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  async update(req, res, next) {

   const data = await calendaryDayExercise.getcalendaryDayExercise(req.params.idcalendaryDayExercise);
   if (data.length === 0) {
     res.status(404); // Not Found
   }

   try{
     const updated = await data.updatecalendaryDayExercise(req.body);
     if (updated) {
       res.status(200);// OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     next(e);
   }
   res.send(data);
 }



}
module.exports = new calendaryDayExerciseCtrl();
