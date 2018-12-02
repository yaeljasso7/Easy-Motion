const router = require('express').Router();
const { calendarCtrl } = require('../controllers');
const mw = require('../middlewares');

router.get('/', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    query: {
      page: 'number',
      name: 'word',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'Calendar');
}, calendarCtrl.getAll);

router.get('/:calendarId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
  });
}, calendarCtrl.get);

// FIXME por claridad este use deberia estar al inicio antes que todas las rutas para dejar claro que todas pasan por este middleware
router.use('/', [mw.auth.haveSession,
  (req, res, next) => {
    mw.auth.havePermission(req, res, next, 'manageCalendars');
  }]);

router.post('/', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}, calendarCtrl.create);

router.put('/:calendarId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
    body: {
      name: 'required,word',
    },
  });
}, calendarCtrl.update);

router.delete('/:calendarId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
  });
}, calendarCtrl.delete);

router.post('/:calendarId/routine', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
    body: {
      routineId: 'required,number',
      day: 'required,number',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      routineId: 'Routine',
    },
  });
}], calendarCtrl.addRoutine);

router.delete('/:calendarId/routine', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
    body: {
      routineId: 'required,number',
      day: 'required,number',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      routineId: 'Routine',
    },
  });
}], calendarCtrl.removeRoutine);

module.exports = router;
