const router = require('express').Router();
const { exercisesCtrl } = require('../controllers');
const { auth, validator, reference } = require('../middlewares');

router.get('/', exercisesCtrl.getAll);

router.get('/:exerciseId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      exerciseId: 'number',
    },
  });
}, exercisesCtrl.get);

router.use('/', [auth.haveSession,
  (req, res, next) => {
    auth.havePermission(req, res, next, 'manageExercises');
  }]);

router.post('/', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      difficulty: 'number,required',
      trainingType: 'number,required',
      bodyPart: 'number,required',
    },
  });
}, (req, res, next) => {
  reference.validate(req, res, next, {
    body: {
      bodyPart: 'BodyPart',
      trainingType: 'TrainingType',
    },
  });
}], exercisesCtrl.create);

router.put('/:exerciseId', [(req, res, next) => {
  validator.validate(req, res, next, {
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
  reference.validate(req, res, next, {
    body: {
      trainingType: 'TrainingType',
      bodyPart: 'BodyPart',
    },
  });
}], exercisesCtrl.update);

router.delete('/:exerciseId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      exerciseId: 'number',
    },
  });
}], exercisesCtrl.delete);

module.exports = router;
