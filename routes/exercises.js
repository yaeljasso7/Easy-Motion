const router = require('express').Router();
const { exercisesCtrl } = require('../controllers');
const middlewares = require('../middlewares');

router.get('/', exercisesCtrl.getAll);

router.get('/:exerciseId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      exerciseId: 'number',
    },
  });
}, exercisesCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      difficulty: 'number,required',
      trainingType: 'number,required',
      bodyPart: 'number,required'
    },
  });
}, exercisesCtrl.create);

router.put('/:exerciseId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
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
}, exercisesCtrl.update);

router.delete('/:exerciseId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      exerciseId: 'number',
    },
  });
}, exercisesCtrl.delete);

module.exports = router;
