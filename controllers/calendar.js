const { Calendar, ResponseMaker } = require('../models');

/**
 * @class Calendar controller
 * - Contains the getAll, get, create, delete, update
 *    addRoutine & removeRoutine methods
 */
class CalendarCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addRoutine = this.addRoutine.bind(this);
    this.removeRoutine = this.removeRoutine.bind(this);
    this.type = 'Calendar';
    this.routinesCalendarType = 'Routine-Calendar';
  }

  /**
  * @async
  * Async function to get all calendars from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async getAll(req, res, next) {
    try {
      const calendars = await Calendar.getAll(req.query);
      return res.send(ResponseMaker.paginated({
        page: req.query.page,
        type: this.type,
        data: calendars,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to get specific calendar from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async get(req, res, next) {
    const id = req.params.calendarId;
    try {
      const calendar = await Calendar.get(id);
      if (!calendar.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }
      return res.send(ResponseMaker.ok({
        msg: 'Found',
        type: this.type,
        data: calendar,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to create a calendar into database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async create(req, res, next) {
    try {
      const calendar = await Calendar.create(req.body);
      if (calendar.id) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.type,
            data: calendar,
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.type,
        data: calendar,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to delete specific calendar from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async delete(req, res, next) {
    const id = req.params.calendarId;
    try {
      const calendar = await Calendar.get(id);

      if (!calendar.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const deleted = await calendar.delete();
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
  * Async function to update specific calendar from database using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {
    const id = req.params.calendarId;
    try {
      const calendar = await Calendar.get(id);

      if (!calendar.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id },
        }));
      }

      const updated = await calendar.update(req.body);
      if (updated) {
        return res.send(ResponseMaker.ok({
          msg: 'Updated',
          type: this.type,
          data: { ...calendar, ...req.body },
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
  * Async function to add routine to calendar from database using the Calendar Model
      and Routine Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async addRoutine(req, res, next) {
    const { calendarId } = req.params;
    try {
      const calendar = await Calendar.get(calendarId);
      if (!calendar.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id: calendarId },
        }));
      }
      const added = await calendar.addRoutine(req.body);
      if (added) {
        return res.status(201)
          .send(ResponseMaker.created({
            type: this.routinesCalendarType,
            data: {
              calendarId: calendar.id,
              ...req.body,
            },
          }));
      }
      return next(ResponseMaker.conflict({
        type: this.routinesCalendarType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }

  /**
  * @async
  * Async function to remove a Routine assigned to this calendar from database
  *   using the Calendar Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response that will give this function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async removeRoutine(req, res, next) {
    const { calendarId } = req.params;
    try {
      const calendar = await Calendar.get(calendarId);
      if (!calendar.id) {
        return next(ResponseMaker.notFound({
          type: this.type,
          data: { id: calendarId },
        }));
      }
      const deleted = await calendar.removeRoutine(req.body);
      if (deleted) {
        return res.send(ResponseMaker.ok({
          msg: 'Deleted',
          type: this.routinesCalendarType,
          data: req.body,
        }));
      }
      return next(ResponseMaker.notFound({
        type: this.routinesCalendarType,
        data: req.body,
      }));
    } catch (err) {
      return next(err);
    }
  }
}
module.exports = new CalendarCtrl();
