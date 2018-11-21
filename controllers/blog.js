// blog controller
const { Blog, ResponseMaker } = require('../models');

/**
 *
 * @class Class of controller Blog
 * - Contains the getAll, get, create, delete & update methods
 */
class BlogCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.type = 'Blog';
  }

  /**
  * @async
  * Async function to get all blogs from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.getAll(req.query);
      return res.render('blogs', ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: blogs,
      }));
      /*
      return res.render('blogs', {
        bgs: blogs,
      });
      */
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get a specific blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.blogId;
    try {
      const blog = await Blog.get(id);
      if (!blog.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: blog,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a blog finto database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const blog = await Blog.create(req.body);
      if (blog.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: blog,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: blog,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to delete a specific blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.blogId;
    try {
      const blog = await Blog.get(id);

      if (!blog.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await blog.delete();
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
  * Async function to iptate a specific blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.blogId;
    try {
      const blog = await Blog.get(id);
      if (!blog.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      const updated = await blog.update(req.body);
      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...blog, ...req.body },
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
module.exports = new BlogCtrl();
