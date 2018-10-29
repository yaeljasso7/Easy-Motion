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
      height: 'isHeight,required',
      weight: 'isWeight,required',
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

router.use('/:userId', (req, res, next) => {
  mw.auth.havePermission(req, res, next, 'manageMyUser');
});

router.get('/:userId', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
  });
}], usersCtrl.get);

router.put('/:userId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      mobile: 'iscellphone',
      email: 'email',
      height: 'isHeight',
      weight: 'isWeight',
    },
  });
}, usersCtrl.update);

router.post('/:userId/calendars', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      userId: 'number',
    },
    body: {
      calendarId: 'number',
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
    params: {
      userId: 'number',
    },
    body: {
      calendarId: 'number',
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
    params: {
      userId: 'number',
    },
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
    params: {
      userId: 'number',
    },
    query: {
      page: 'number',
      height: 'number',
      weight: 'number',
      date: 'optionalDate',
      sort: 'word',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'ProgressUser');
}], usersCtrl.getProgress);

router.post('/:userId/progress', (req, res, next) => {
  mw.validator.validate(req, res, next, {
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
