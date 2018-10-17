const { Routine } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class RoutinesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.getExercises = this.getExercises.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.updateExerciseReps = this.updateExerciseReps.bind(this);
  }

  async getAll(req, res) {
    let data = await Routine.getAll();

    // FIXME El objeto tiene formato de paginado, pero no es real
    const json = {
      data: data,
      total_count: data.length,
      per_page: data.length,
      page: 0,
    };
    if (data.length === 0) {
      res.status(204);
    }
    res.send(json);
  }

  async get(req, res) {
    const id = req.params.routineId;
    let data = await Routine.get(id);
    if (data.length === 0) {
      res.status(404);
    }
    res.send(data);
  }

  async create(req, res, next) {
    try {
      const data = await Routine.create(req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {

   const data = await Routine.get(req.params.routineId);
   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.update(req.body);
     if (updated) {
       res.status(200); // OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     res.status(409);
     next(e);
   }

   res.send({ ...data, ...req.body });
 }

 async delete(req, res, next){
   let deleted;
   try {
     deleted = await Routine.delete(req.params.routineId);
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

 async addExercise(req, res, next) {
   const { routineId } = req.params;
   try {
     const data = await Routine.addExercise(routineId, req.body);
     res.status(201).send(data);
   } catch (err) {
     next(err);
   }
 }

 async removeExercise(req, res, next){
   const { routineId } = req.params;
   let deleted;
   try {
     deleted = await Routine.removeExercise(routineId, req.body);
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

 async updateExerciseReps(req, res, next) {
   const { routineId } = req.params;
   let updated;
   try {
     updated = await Routine.updateExerciseReps(routineId, req.body);
   } catch (error) {
     next(error);
   }

   if (updated) {
     res.status(200); // OK
   } else {
     res.status(404); // Not Found
   }

   res.send();
 }

 async getExercises(req, res) {
   const id = req.params.routineId
   const data = await Routine.getExercises(id);

   // FIXME El objeto tiene formato de paginado, pero no es real
   const json = {
     data: data,
     total_count: data.length,
     per_page: data.length,
     page: 0,
   };
   if (data.length === 0) {
     res.status(204);
   }
   res.send(json);
 }

}

module.exports = new RoutinesCtrl();
