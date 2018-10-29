// controladores categoryBlog
const { categoryBlog, ResponseMaker } = require('../models');

/**
 *
 * @class Class of controller CategoryBlog
 * - Contains the getAll, get, create, delete & update methods
 */
class CategoryBlogCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'BlogCategory';
  }

  /**
  * @async
  * Async function to get all categoryBlog from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const categories = await categoryBlog.getAll(req.query);

      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: categories,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get all categoryBlog from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.categoryBlogId;
    try {
      const category = await categoryBlog.get(id);
      if (!category.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: category,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a categoryBlog into database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const category = await categoryBlog.create(req.body);
      if (category.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: category,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: category,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to update a categoryBlog from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.categoryBlogId;
    try {
      const category = await categoryBlog.get(id);

      if (!category.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const updated = await category.update(req.body);
      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...category, ...req.body },
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
  * Async function delete specific categoryBlog from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.categoryBlogId;
    try {
      const category = await categoryBlog.get(id);

      if (!category.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await category.delete();
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

module.exports = new CategoryBlogCtrl();
