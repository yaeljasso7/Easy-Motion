const { TrainingType } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class TrainingTypesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(req, res) {
    const data = await TrainingType.getAll();

    // FIXME El objeto tiene formato de paginado, pero no es real
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
    const data = await TrainingType.get(req.params.trainingTypeId);
    const json = {
      data,
    };
    if (data.length === 0) {
      res.status(404);
    }
    res.send(json);
  }

  async create(req, res, next) {
    try {
      const data = await TrainingType.create(req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {

   const data = await TrainingType.get(req.params.trainingTypeId);

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
   // FIXME ESto deberia regresar un objeto de tipo del recurso idealmente o un objeto con un formato definido para respuestas
   res.send( Object.assign(data, req.body) ); // FIXME en lugar de usar assign puede hacer spread { ...data, ...req.body }
 }

 async delete(req, res, next){
   const deleted = await TrainingType.delete(req.params.trainingTypeId);

     if (deleted) {
       res.status(200); // OK
     } else {
       res.status(404); // Not Found
     }

     res.send();
 }

}

module.exports = new TrainingTypesCtrl();
