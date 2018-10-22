const router = require('express').Router();
const { usersCtrl } = require('../controllers');
const { auth, validator, reference } = require('../middlewares');

router.use('/', auth.haveSession);

router.get('/', [(req, res, next) => {
  auth.havePermission(req, res, next, 'manageUsers');
}], usersCtrl.getAll);

router.post('/', [(req, res, next) => {
  auth.havePermission(req, res, next, 'manageUsers');
},
(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      mail: 'email,required',
      mobile: 'iscellphone',
      height: 'isHeight,required',
      weight: 'isWeight,required',
    },
  });
}], usersCtrl.create);

router.delete('/:userId', (req, res, next) => {
  auth.havePermission(req, res, next, 'manageUsers');
}, (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.delete);

router.use('/:userId', (req, res, next) => {
  auth.havePermission(req, res, next, 'manageMyUser');
});

router.get('/:userId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}], usersCtrl.get);

router.put('/:userId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      mobile: 'iscellphone',
      height: 'isHeight',
      weight: 'isWeight',
    },
  });
}, usersCtrl.update);

router.post('/:userId/calendars', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      calendarId: 'number',
    },
  });
}, (req, res, next) => {
  reference.validate(req, res, next, {
    body: {
      calendarId: 'Calendar',
    },
  });
}], usersCtrl.addCalendar);

router.delete('/:userId/calendars', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      calendarId: 'number',
    },
  });
}, (req, res, next) => {
  reference.validate(req, res, next, {
    body: {
      calendarId: 'Calendar',
    },
  });
}], usersCtrl.removeCalendar);

router.get('/:userId/calendars', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.getCalendars);

router.get('/:userId/progress', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.getProgress);

router.post('/:userId/progress', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      weight: 'number,isWeight',
      height: 'number,isHeight',
    },
  });
}, usersCtrl.addProgress);

module.exports = router;
