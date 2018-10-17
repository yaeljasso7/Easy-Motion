const { Exercise } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class ExercisesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(req, res) {
    const data = await Exercise.getAll();

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
    let data = await Exercise.get(req.params.exerciseId);
    if (data.length === 0) {
      res.status(404);
    }
    res.send(data);
  }

  async create(req, res, next) {
    try {
      const data = await Exercise.create(req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    const id = req.params.exerciseId;
    const data = await Exercise.get(id);
    if (data.length === 0) {
      res.status(404).send(data);
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

    res.send( Object.assign(data, req.body) );
  }

  async delete(req, res, next){
    const deleted = await Exercise.delete(req.params.exerciseId);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }
}

module.exports = new ExercisesCtrl();
