const { Routine } = require('../models');

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
  }

  async getAll(req, res) {
    const data = await Routine.getAll();
    const json = {
      data,
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
    let data = await Routine.get(req.params.routineId);
    if (data.length === 0) {
      res.status(204);
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

   res.send(data);
 }

 async delete(req, res, next){
   const deleted = await Routine.delete(req.params.routineId);

     if (deleted) {
       res.status(200); // OK
     } else {
       res.status(404); // Not Found
     }

     res.send();
 }

  async addExercise(req, res, next) {
    const id = req.params.routineId;
    try {
      const data = await Routine.addExercise(id, req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async getExercises(req, res) {
    const id = req.params.routineId;
    const data = await Routine.getExercises(id);
    const json = {
      data,
      total_count: data.length,
      per_page: data.length,
      page: 0,
    };
    if (data.length === 0) {
      res.status(204);
    }
    res.send(json);
  }

  removeExercise(req, res, next) {

  }
}

module.exports = new RoutinesCtrl();
