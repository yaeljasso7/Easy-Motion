const router = require('express').Router();
const { usersCtrl } = require('../controllers');
const mw = require('../middlewares');

router.use('/', mw.auth.haveSession);

router.get('/', [(req, res, next) => {
  mw.auth.havePermission(req, res, next, 'manageUsers');
}, (req, res, next) => {
  mw.validator.validate(req, res, next, {
    query: {
      page: 'number',
      name: 'word',
      role: 'number',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'User');
}], usersCtrl.getAll);

router.post('/', [(req, res, next) => {
  mw.auth.havePermission(req, res, next, 'manageUsers');
},
(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      email: 'email,required',
      mobile: 'iscellphone',
      height: 'number,isHeight,required',
      weight: 'number,isWeight,required',
    },
  });
}], usersCtrl.create);

router.delete('/:userId', (req, res, next) => {
  mw.auth.havePermission(req, res, next, 'manageUsers');
}, (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, usersCtrl.delete);

router.use('/:userId', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}, (req, res, next) => {
  mw.auth.havePermission(req, res, next, 'manageMyUser');
}]);

router.get('/:userId', usersCtrl.get);

router.put('/:userId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word',
      mobile: 'iscellphone',
      email: 'email',
    },
  });
}, usersCtrl.update);

router.post('/:userId/calendars', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      calendarId: 'number,required',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      calendarId: 'Calendar',
    },
  });
}], usersCtrl.addCalendar);

router.delete('/:userId/calendars', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      calendarId: 'number,required',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      calendarId: 'Calendar',
    },
  });
}], usersCtrl.removeCalendar);

router.get('/:userId/calendars', [(req, res, next) => {
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
}], usersCtrl.getCalendars);

router.get('/:userId/progress', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    query: {
      page: 'number',
      date: 'date',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'ProgressUser');
}], usersCtrl.getProgress);

router.post('/:userId/progress', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      weight: 'number,isWeight,required',
      height: 'number,isHeight,required',
    },
  });
}, usersCtrl.addProgress);

module.exports = router;
