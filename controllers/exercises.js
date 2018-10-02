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
    const data = await Exercise.getExercises();
    const json = {
      data,
      total_count:  data.length,
      per_page: data.length,
      page: 0,
    };
    res.send(json);
  }

  async get(req, res) {
    const data = await Exercise.getExercise(req.params.exerciseId);
    const json = {
      data,
    };
    res.send(json);
  }

  async create(req, res) {
    try {
      const data = await Exercise.createExercise(req.body);
      res.send(data);
    } catch (err) {
      throw e;
    }
  }

  async update(req, res, next) {
    const id = req.params.exerciseId;
    console.log('update-ctrl');
    const data = await Exercise.getExercise(id);
    if( data.length === 0 ) {
      res.status(404).send(data);
    }
    let status;
    try {
      const updated = await Exercise.updateExercise(id, req.body);
      status = updated ? 200 : 409;
    } catch (err) {
      res.status(409);
      next(err);
    }
    res.status(status).send(data);
  }

  delete(req, res) {

  }
}

module.exports = new ExercisesCtrl();
