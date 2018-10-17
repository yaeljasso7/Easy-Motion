const { BodyPart, ResponseMaker } = require('../models');

// FIXME Falta documentacion en todos los metodos

class BodyPartsCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this._type = 'bodyPart';
  }

  async getAll(req, res, next) {
    try {
      const data = await BodyPart.getAll();

      // FIXME El objeto tiene formato de paginado, pero no es real
      if (data.length === 0) {
        res.status(204);
        res.send(ResponseMaker.noContent(this._type));
      } else {
        res.send(ResponseMaker.paginated(0, this._type, data));
      }
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    const id = req.params.bodyPartId
    try {
      const data = await BodyPart.get(id);
      if (data.length === 0) {
        res.status(404);
        res.send(ResponseMaker.notFound(this._type, { id }));
      } else {
        res.send(ResponseMaker.ok('Found', this._type, data));
      }
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await BodyPart.create(req.body);
      res.status(201)
      .send(ResponseMaker.created(this._type, data));
    } catch (err) {
      return next(err);
    }
  }

  async delete(req, res, next){
    const id = req.params.bodyPartId;
    try {
      const deleted = await BodyPart.delete(req.params.bodyPartId);

        if (deleted) {
          res.status(200)
          .send(ResponseMaker.ok('Deleted', this._type, { id }));
        } else {
          res.status(404)
          .send(ResponseMaker.notFound());
        }
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    const id = req.params.bodyPartId;

    try {
      const data = await BodyPart.get(id);

      if (data.length === 0) {
        return res.status(404)
        .send(ResponseMaker.notFound(this._type, { id }));
      }

      const updated = await data.update(req.body);

      if (updated) {
        res.status(200)
        .send(ResponseMaker.ok('Updated', this._type, { id, fields: req.body }));
      } else {
        res.status(409)
        .send(ResponseMaker.confict(this._type, req.body));
      }
    } catch(err) {
      return next(err);
    }
 }
}

module.exports = new BodyPartsCtrl();
