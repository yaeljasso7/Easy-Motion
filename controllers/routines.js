const { Routine } = require('../models');

class RoutinesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(req, res) {
    let data = await Routine.getAll();
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


}

module.exports = new RoutinesCtrl();
