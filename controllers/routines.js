const { Routine, ResponseMaker } = require('../models');

/**
 * @class Routine Controller
 * - Contains the getAll, get, create, delete & update methods
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
    this.type = 'Routine';
    this.exerciseRoutineType = 'Exercise-Routine';
  }

  /**
  * @async
  * Async function to get all Routines from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const routines = await Routine.getAll(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: routines,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get a especific Routine from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.routineId;
    try {
      const routine = await Routine.get(id);
      if (!routine.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: routine,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a routine into database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const routine = await Routine.create(req.body);
      if (routine.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: routine,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: routine,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to update a especific Routine from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.routineId;
    try {
      const routine = await Routine.get(id);
      if (!routine.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      const updated = await routine.update(req.body);
      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...routine, ...req.body },
        }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to delete a especific Routine from database using the Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.exerciseId;
    try {
      const routine = await Routine.get(id);

      if (!routine.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await routine.delete();
      if (deleted) {
        return res.send(ResponseMaker.ok({
          msg: 'Deleted',
          type: this.type,
          data: { id },
        }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to add an exercise to a specific routine
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async addExercise(req, res, next) {
    const { routineId } = req.params;
    try {
      const routine = await Routine.get(routineId);
      if (!routine.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id: routineId },
        }));
      }
      const added = await routine.addExercise(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.exerciseRoutineType,
            data: {
              routineId: routine.id,
              exerciseId: req.body.exerciseId,
            },
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.exerciseRoutineType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to remove an exercise from a specific routine
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async removeExercise(req, res, next) {
    const { routineId } = req.params;
    try {
      const routine = await Routine.get(routineId);
      if (!routine.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id: routineId },
        }));
      }
      const deleted = await routine.removeExercise(req.body);
      if (deleted) {
        return res.send(ResponseMaker.ok({
          msg: 'Deleted',
          type: this.exerciseRoutineType,
          data: req.body,
        }));
      }
      return next(ResponseMaker.conflict({
        type: this.exerciseRoutineType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to update the times an exercises must be repeated in a specific routine
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async updateExerciseReps(req, res, next) {
    const { routineId } = req.params;
    try {
      const routine = await Routine.get(routineId);
      if (!routine.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id: routineId },
        }));
      }
      const updated = await routine.updateExerciseReps(req.body);
      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.exerciseRoutineType,
          data: req.body,
        }));
      }
      return next(ResponseMaker.conflict({
        type: this.exerciseRoutineType,
        data: req.body,
      }));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RoutinesCtrl();
