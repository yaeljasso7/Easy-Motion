//controladores calendarDayExercise
const { calendarDayExercise } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class calendarDayExerciseCtrl{
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

   async getAll(req, res){

     let data = await calendarDayExercise.getcalendarDayExercises();

      // FIXME El objeto tiene formato de paginado, pero no es real
     const json = {
       data: data,
       total_count: data.length,
       per_page: data.length,
       page: 0,
     };

     // In case calendarDayExercise was not found
     if (data.length === 0) {
       res.status(204);
     }

     res.send(json);
  }

  async get(req, res){
      let data = await calendarDayExercise.getcalendarDayExercise(req.params.idcalendarDayExercise);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  async create(req, res, next){
    try {
      let data = await calendarDayExercise.createcalendarDayExercise(req.body); //req.body {}
      res.status(201).send(data);
    } catch (e) {
      res.status (409).send("Insert error: " + e.duplicated.message);
      next(e);
    }
  }

  async delete(req, res, next){
    const deleted = await calendarDayExercise.deletecalendarDayExercise(req.params.idcalendarDayExercise);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  async update(req, res, next) {

   const data = await calendarDayExercise.getcalendarDayExercise(req.params.idcalendarDayExercise);
   if (data.length === 0) {
     res.status(404); // Not Found
   }

   try{
     const updated = await data.updatecalendarDayExercise(req.body);
     if (updated) {
       res.status(200);// OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     next(e);
   }
   // FIXME ESto deberia regresar un objeto de tipo user idealmente o un objeto con un formato definido para respuestas
   res.send( {...data, ...req.body} ); 
 }



}
module.exports = new calendarDayExerciseCtrl();
