const router = require('express').Router();
const { exercisesCtrl } = require('../controllers');
const mw = require('../middlewares');

router.get('/', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    query: {
      page: 'number',
      name: 'word',
      bodyPart: 'word',
      trainingType: 'word',
      difficulty: 'number',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'Exercise');
}, exercisesCtrl.getAll);

router.get('/:exerciseId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      exerciseId: 'number',
    },
  });
}, exercisesCtrl.get);

router.use('/', [mw.auth.haveSession,
  (req, res, next) => {
    mw.auth.havePermission(req, res, next, 'manageExercises');
  }]);

router.post('/', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      difficulty: 'number,required',
      trainingType: 'number,required',
      bodyPart: 'number,required',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      bodyPart: 'BodyPart',
      trainingType: 'TrainingType',
    },
  });
}], exercisesCtrl.create);

router.put('/:exerciseId', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word',
      difficulty: 'number',
      trainingType: 'number',
      bodyPart: 'number',
    },
    params: {
      exerciseId: 'number',
    },
  });
}, (req, res, next) => {
  mw.reference.validate(req, res, next, {
    body: {
      trainingType: 'TrainingType',
      bodyPart: 'BodyPart',
    },
  });
}], exercisesCtrl.update);

router.delete('/:exerciseId', [(req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      exerciseId: 'number',
    },
  });
}], exercisesCtrl.delete);

module.exports = router;
