const { BodyPart, ResponseMaker } = require('../models');

/**
 * @class BodyPart Controller
 * - Contains the getAll, get, create, delete & update methods
 */
class BodyPartsCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'BodyPart';
  }

  /**
  * @async
  * Async function to get all BodyParts from database using the BodyPart Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const bodyParts = await BodyPart.getAll(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: bodyParts,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get a specific bodyPart from database using the BodyPart Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.bodyPartId;
    try {
      const bodyPart = await BodyPart.get(id);
      if (!bodyPart.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: bodyPart,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a bodyPart into database using the BodyPart Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const bodyPart = await BodyPart.create(req.body);
      if (!bodyPart.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: bodyPart,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: bodyPart,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to delete a specific bodyPart from database using the BodyPart Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.bodyPartId;
    try {
      const bodyPart = await BodyPart.get(id);

      if (!bodyPart.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await bodyPart.delete();

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
  * Async function to update a specific bodyPart from database using the BodyPart Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that vill give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.bodyPartId;

    try {
      const bodyPart = await BodyPart.get(id);

      if (!bodyPart.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const updated = await bodyPart.update(req.body);

      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
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

module.exports = new BodyPartsCtrl();
