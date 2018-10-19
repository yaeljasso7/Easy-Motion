const { Calendar, ResponseMaker } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar
// los errores a traves de un try-catch

class CalendarCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addRoutine = this.addRoutine.bind(this);
    this.removeRoutine = this.removeRoutine.bind(this);
    this.type = 'calendar';
  }

  async getAll(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    try {
      const data = await Calendar.getCalendars(page);

      if (data.length === 0) {
        res.status(204);
        return res.send(ResponseMaker.noContent(this.type));
      }
      return res.send(ResponseMaker.paginated(page, this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    const id = req.params.idCalendar;
    try {
      const data = await Calendar.getCalendar(id);
      if (data.length === 0) {
        res.status(404);
        return res.send(ResponseMaker.notFound(this.type, { id }));
      }
      return res.send(ResponseMaker.ok('Found', this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await Calendar.createCalendar(req.body); // req.body {}
      res.status(201).send(ResponseMaker.created(this.type, data));
    } catch (e) {
      res.status(409).send(`Insert error: ${e.duplicated.message}`);
      next(e);
    }
  }

  async delete(req, res, next) {
    const id = req.params.idCalendar;
    try {
      const deleted = await Calendar.deleteCalendar(id);

      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', this.type, { id }));
      }
      return res.status(404)
        .send(ResponseMaker.notFound());
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    const id = req.params.idCalendar;
    try {
      const data = await Calendar.getCalendar(id);

      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }

      const updated = await data.updateCalendar(req.body);
      if (updated) {
        return res.status(200)
          .send(ResponseMaker.ok('Updated', this.type, { ...data, ...req.body }));
      }
      return res.status(409)
        .send(ResponseMaker.confict(this.type, req.body));
    } catch (e) {
      return next(e);
    }
  }

  async addRoutine(req, res, next) {
    const { idCalendar } = req.params;
    const { idRoutine, day } = req.body;
    try {
      const data = await Calendar.addRoutine(idCalendar, idRoutine, day);
      return res.status(201)
        .send(ResponseMaker.created(this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async removeRoutine(req, res, next) {
    const { idCalendar } = req.params;
    const { idRoutine, day } = req.body;
    let deleted;
    try {
      deleted = await Calendar.removeRoutine(idCalendar, idRoutine, day);
      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', this.type, { idCalendar }));
      }
      return res.status(404)
        .send(ResponseMaker.notFound());
    } catch (error) {
      return next(error);
    }
  }
}
module.exports = new CalendarCtrl();
