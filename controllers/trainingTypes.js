const { TrainingType, ResponseMaker } = require('../models');

/**
 * @class TrainingType controller
 * - Contains the getAll, get, create, delete & update methods
 */
class TrainingTypesCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'TrainingType';
  }

  /**
  * @async
  * Async function to get all TrainingTypes from database using the TrainingType Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const trainingTypes = await TrainingType.getAll(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: trainingTypes,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get specific TrainingType from database using the
  * TrainingType Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.trainingTypeId;
    try {
      const trainingType = await TrainingType.get(id);
      if (!trainingType.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: trainingType,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create specific TrainingType into database using the
  * TrainingType Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const trainingType = await TrainingType.create(req.body);
      if (trainingType.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: trainingType,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: trainingType,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to update specific TrainingType from database using the
  * TrainingType Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.trainingTypeId;
    try {
      const trainingType = await TrainingType.get(id);

      if (!trainingType.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const updated = await trainingType.update(req.body);

      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...trainingType, ...req.body },
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
  * Async function to delete specific TrainingType from database using the
  * TrainingType Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.trainingTypeId;
    try {
      const trainingType = await TrainingType.get(id);

      if (!trainingType.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await trainingType.delete();

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

module.exports = new TrainingTypesCtrl();
