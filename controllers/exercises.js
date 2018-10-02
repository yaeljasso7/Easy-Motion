const { Exercise } = require('../models');

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
    const data = await Exercise.get(req.params.exerciseId);
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
    let status;
    try {
      const updated = await Exercise.update(id, req.body);
      status = updated ? 200 : 409;
    } catch (err) {
      res.status(409);
      next(err);
    }
    res.status(status).send(data);
  }

  delete (req, res, next) {

  }
}

module.exports = new ExercisesCtrl();
