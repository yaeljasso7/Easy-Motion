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

  create(req, res) {

  }

  update(req, res) {

  }

  delete(req, res) {

  }
}

module.exports = new ExercisesCtrl();
