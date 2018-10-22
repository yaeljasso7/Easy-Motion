// controlador users
const { User, ResponseMaker } = require('../models');

/**
 *
 * @class Class of controller User
 * - Contain the getAll, get, create, delete, update, addCalendar, revemoveCalendar
 * getCaelendars, addProgress, getProgess functions
 */
class UserCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addCalendar = this.addCalendar.bind(this);
    this.removeCalendar = this.removeCalendar.bind(this);
    this.getCalendars = this.getCalendars.bind(this);
    this.addProgress = this.addProgress.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this.type = 'user';
  }
  /**
  * @async
  * Async function to get all users from database using the User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async getAll(req, res, next) {
    console.log(req.session);
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    try {
      const data = await User.getAll(page);

      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent(this.type));
      }
      return res.send(ResponseMaker.paginated(page, this.type, data));
    } catch (err) {
      return next(err);
    }
  }
  /**
  * @async
  * Async function to get specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async get(req, res, next) {
    const id = req.params.userId;
    try {
      const user = await User.get(id);
      if (user.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id }));
      }
      return res.send(ResponseMaker.ok('Found', this.type, user));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async create(req, res, next) {
    try {
      const user = await User.create(req.body);
      if (user.length !== 0) {
        return res.status(201)
          .send(ResponseMaker.created(this.type, user));
      }
      return res.status(409)
        .send(ResponseMaker.conflict(this.type, user));
    } catch (err) {
      // res.status(409).send(`Insert error: ${e.duplicated.message}`);
      return next(err);
    }
  }

  /**
  * @async
  * Async function to delete specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async delete(req, res, next) {
    const id = req.params.userId;
    try {
      const data = await User.get(id);

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
  * Async function to update specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async update(req, res, next) {
    const id = req.params.userId;
    try {
      const data = await User.get(id);

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
  * Async function to add calendars to the user from database using
      User Model and Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async addCalendar(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (user.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: userId }));
      }
      const added = await user.addCalendar(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created('calendars_users', {
            userId: user.id,
            ...req.body,
          }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict('calendars_users', req.body));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to remove calendars assigned to specific user from database using User Model
      and Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async removeCalendar(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (user.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: userId }));
      }
      const deleted = await user.removeCalendar(req.body);
      if (deleted) {
        return res.status(200)
          .send(ResponseMaker.ok('Deleted', 'calendars_users', req.body));
      }
      return res.status(404)
        .send(ResponseMaker.notFound('calendars_users', req.body));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get calendars assinged to the user from database using User Model
      and Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async getCalendars(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (user.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { userId }));
      }
      const data = await user.getCalendars(page);
      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent('users_calendars'));
      }
      return res.send(ResponseMaker.paginated(page, 'users_calendars', data));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get the prossess of specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async getProgress(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (user.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { userId }));
      }
      const data = await user.getProgress(page);
      if (data.length === 0) {
        return res.status(204)
          .send(ResponseMaker.noContent('users_progress'));
      }
      return res.send(ResponseMaker.paginated(page, 'users_progress', data));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to add progress to specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async addProgress(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (user.length === 0) {
        return res.status(404)
          .send(ResponseMaker.notFound(this.type, { id: userId }));
      }
      const added = await user.addProgress(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created('users_progress', {
            userId: user.id,
            ...req.body,
          }));
      }
      return res.status(409)
        .send(ResponseMaker.conflict('users_progress', req.body));
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UserCtrl();
