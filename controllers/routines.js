const { Routine, ResponseMaker } = require('../models');

/**
 * @class BodyParts Controller
 * - Contain the getAll, get, create, delete, update methods
 */

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

  /**
  * @async
  * Async function to get all Routines from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const data = await Routine.getAll(req.query);
      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent(this.type));
      }
      return res.status(200)
        .send(ResponseMaker.paginated(req.query.page, this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get a especific Routine from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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

  /**
  * @async
  * Async function to create a routine into database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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

  /**
  * @async
  * Async function to update a especific Routine from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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

  /**
  * @async
  * Async function to delete a especific Routine from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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

  /**
  * @async
  * Async function to add an exercise to a specific routine
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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

  /**
  * @async
  * Async function to remove an exercise from a specific routine
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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

  /**
  * @async
  * Async function to update the times an exercises must be repeated in a specific routine
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
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
