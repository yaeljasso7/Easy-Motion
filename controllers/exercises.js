const { Exercise, ResponseMaker } = require('../models');

/**
 *
 * @class Exercise Controller
 * - Contains the getAll, get, create, delete & update methods
 */
class ExercisesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'Exercise';
  }

  /**
  * @async
  * Async function to get all exercises from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const exercises = await Exercise.getAll(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: exercises,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get a specific exercise from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async get(req, res, next) {
    const id = req.params.exerciseId;
    try {
      const exercise = await Exercise.get(id);
      if (!exercise.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: exercise,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a exercise into database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async create(req, res, next) {
    try {
      const exercise = await Exercise.create(req.body);
      if (!exercise.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: exercise,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: exercise,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to update specific exercise from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.exerciseId;
    try {
      const exercise = await Exercise.get(id);

      if (!exercise.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const updated = await exercise.update(req.body);

      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...exercise, ...req.body },
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
  * Async function to delete a specific exercise from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = await req.params.exerciseId;
    try {
      const exercise = await Exercise.get(id);

      if (!exercise.id) {
        return next(ResponseMaker.notFound(this.type, { id }));
      }

      const deleted = await exercise.delete();

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
}

module.exports = new ExercisesCtrl();
