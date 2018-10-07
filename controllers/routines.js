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
    const data = await Routine.get(req.params.routineId);
    const json = {
      data,
    };
    if (data.length === 0) {
      res.status(204);
    }
    res.send(json);
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
    const id = req.params.routineId;
    const data = await Routine.get(id);
    if (data.length === 0) {
      res.status(404).send(data);
    }
    let status;
    try {
      const updated = await Routine.update(id, req.body);
      status = updated ? 200 : 409;
    } catch (err) {
      res.status(409);
      next(err);
    }
    res.status(status).send(Object.assign(data, req.body));
  }

  delete (req, res, next) {

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
