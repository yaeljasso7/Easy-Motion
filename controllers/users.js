// controlador users
const { User, ResponseMaker } = require('../models');

/**
 *
 * @class Class of controller User
 * - Contains the getAll, get, create, delete, update, addCalendar, revemoveCalendar
 *    getCalendars, addProgress & getProgess methods
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
    this.type = 'User';
    this.userCalendarType = 'User-Calendar';
    this.userProgressType = 'User-Progress';
  }

  /**
  * @async
  * Async function to get all users from database using the User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const users = await User.getAll(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: users,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.userId;
    try {
      const user = await User.get(id);
      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: user,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create specific user into database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const user = await User.create(req.body);
      if (user.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: user,
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
  * Async function to delete specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.userId;
    try {
      const user = await User.get(id);

      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await user.delete();
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
  * Async function to update specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.userId;
    try {
      const user = await User.get(id);

      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const updated = await user.update(req.body);
      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...user, ...req.body },
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
  * Async function to add calendars to the user from database using
  *  User Model and Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async addCalendar(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (!user.id) {
        return next(ResponseMaker.notFound(this.type, { id: userId }));
      }
      const added = await user.addCalendar(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.userCalendarType,
            data: {
              userId: user.id,
              ...req.body,
            },
          }));
      }
      return next(ResponseMaker.conflict({
        msg: this.userCalendarType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to remove calendars assigned to specific user from database
  *   using User Model and Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async removeCalendar(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.userCalendarType,
          data: { id: userId },
        }));
      }
      const deleted = await user.removeCalendar(req.body);
      if (deleted) {
        return res.send(ResponseMaker.ok({
          msg: 'Deleted',
          type: this.userCalendarType,
          data: req.body,
        }));
      }
      return next(ResponseMaker.notFound({
        type: this.userCalendarType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get calendars assinged to the user from database using
  *   User Model and Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getCalendars(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { userId },
        }));
      }
      const calendars = await user.getCalendars(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.userCalendarType,
        data: calendars,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get the prossess of specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getProgress(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { userId },
        }));
      }
      const progress = await user.getProgress(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.userProgressType,
        data: progress,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to add progress to specific user from database using User Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async addProgress(req, res, next) {
    const { userId } = req.params;
    try {
      const user = await User.get(userId);
      if (!user.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id: userId },
        }));
      }
      const added = await user.addProgress(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.userProgressType,
            data: {
              userId: user.id,
              ...req.body,
            },
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.userProgressType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UserCtrl();
