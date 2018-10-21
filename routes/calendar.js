const router = require('express').Router();
const { calendarCtrl } = require('../controllers');
const middlewares = require('../middlewares');

router.get('/', calendarCtrl.getAll);
router.get('/:calendarId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
  });
}, calendarCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}, calendarCtrl.create);

router.put('/:calendarId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
    body: {
      name: 'required,word',
    },
  });
}, calendarCtrl.update);

router.delete('/:calendarId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
  });
}, calendarCtrl.delete);

router.post('/:calendarId/routine', [(req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
    body: {
      routineId: 'required,number',
      day: 'required,number',
    },
  });
}, (req, res, next) => {
  middlewares.reference.validate(req, res, next, {
    body: {
      routineId: 'Routine',
    },
  });
}], calendarCtrl.addRoutine);

router.delete('/:calendarId/routine', [(req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      calendarId: 'number',
    },
    body: {
      routineId: 'required,number',
      day: 'required,number',
    },
  });
}, (req, res, next) => {
  middlewares.reference.validate(req, res, next, {
    body: {
      routineId: 'Routine',
    },
  });
}], calendarCtrl.removeRoutine);

module.exports = router;
