const { TrainingType } = require('../models');

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
      res.status(204);
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
    const id = req.params.trainingTypeId;
    const data = await TrainingType.get(id);
    if (data.length === 0) {
      res.status(404).send(data);
    }
    let status;
    try {
      const updated = await TrainingType.update(id, req.body);
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

module.exports = new TrainingTypesCtrl();
