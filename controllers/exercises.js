const { Exercise, ResponseMaker } = require('../models');

/**
 *
 * @class Class of controller Exercises
 * - Contain the getAll, get, create, delete, update
 */
class ExercisesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'exercise';
  }

  /**
  * @async
  * Async function to get all exercises from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async getAll(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    try {
      const data = await Exercise.getAll(page);
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

  /**
  * @async
  * Async function to get a specific exercise from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async get(req, res, next) {
    const id = req.params.exerciseId;
    try {
      const data = await Exercise.get(id);
      if (data.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }
      return res.send(ResponseMaker.ok('Found', this.type, data));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a exercise into database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async create(req, res, next) {
    try {
      const data = await Exercise.create(req.body);
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
  * Async function to update especific exercise from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async update(req, res, next) {
    const id = req.params.exerciseId;
    try {
      const data = await Exercise.get(id);

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
  * Async function to delete a especific exercise from database using the Exercise Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async delete(req, res, next) {
    const id = await req.params.exerciseId;
    try {
      const data = await Exercise.get(id);

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

module.exports = new ExercisesCtrl();
