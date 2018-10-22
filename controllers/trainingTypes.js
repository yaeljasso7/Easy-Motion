const { TrainingType, ResponseMaker } = require('../models');

// FIXME Falta documentacion en todos los metodos

class TrainingTypesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'trainingType';
  }

  async getAll(req, res, next) {
    try {
      const data = await TrainingType.getAll(req.query);

      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent(this.type));
      }
      return res.send(ResponseMaker.paginated(req.query.page, this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    const id = req.params.trainingTypeId;
    try {
      const data = await TrainingType.get(id);
      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }
      return res.send(ResponseMaker.ok('Found', this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await TrainingType.create(req.body);
      if (data.length !== 0) {
        return res.status(201)
          .send(ResponseMaker.created(this.type, data));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    const id = req.params.trainingTypeId;
    try {
      const data = await TrainingType.get(id);

      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }

      const updated = await data.update(req.body);

      if (updated) {
        return res.status(200)
          .send(ResponseMaker.ok('Updated', this.type, { ...data, ...req.body }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, req.body));
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next) {
    const id = req.params.trainingTypeId;
    try {
      const data = await TrainingType.get(id);

      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }

      const deleted = await data.delete();

      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', this.type, { id }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, req.body));
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new TrainingTypesCtrl();
