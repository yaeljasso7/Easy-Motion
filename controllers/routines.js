const { Routine, ResponseMaker } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos
//  deberian manejar los errores a traves de un try-catch

class RoutinesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.updateExerciseReps = this.updateExerciseReps.bind(this);
    this.type = 'routine';
  }

  async getAll(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    try {
      const data = await Routine.getAll(page);
      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent(this.type));
      }
      return res.status(200)
        .send(ResponseMaker.paginated(page, this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  async get(req, res, next) {
    const id = req.params.routineId;
    try {
      const routine = await Routine.get(id);
      if (routine.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }
      return res.send(ResponseMaker.ok('Found', this.type, routine));
    } catch (err) {
      return next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await Routine.create(req.body);
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
    const id = req.params.routineId;
    try {
      const data = await Routine.get(id);
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
    const id = req.params.exerciseId;
    try {
      const data = await Routine.get(id);

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

  async addExercise(req, res, next) {
    const { routineId } = req.params;
    try {
      const routine = await Routine.get(routineId);
      if (routine.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: routineId }));
      }
      const added = await routine.addExercise(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created('exercises_routines', {
            routineId: routine.id,
            exerciseId: req.body.exerciseId,
          }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict('exercises_routines', req.body));
    } catch (err) {
      return next(err);
    }
  }

  async removeExercise(req, res, next) {
    const { routineId } = req.params;
    try {
      const routine = await Routine.get(routineId);
      if (routine.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: routineId }));
      }
      const deleted = await routine.removeExercise(req.body);
      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', 'exercises_routines', req.body));
      }
      return res.status(409)
        .send(ResponseMaker.conflict('exercises_routines', req.body));
    } catch (err) {
      return next(err);
    }
  }

  async updateExerciseReps(req, res, next) {
    const { routineId } = req.params;
    try {
      const routine = await Routine.get(routineId);
      if (routine.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: routineId }));
      }
      const updated = await routine.updateExerciseReps(req.body);
      if (updated) {
        return res.status(200)
          .send(ResponseMaker.ok('Updated', 'exercises_routines', req.body));
      }
      return res.status(409)
        .send(ResponseMaker.conflict('exercises_routines', req.body));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RoutinesCtrl();
