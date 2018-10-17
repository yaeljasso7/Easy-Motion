const router = require('express').Router();
const { routinesCtrl } = require('../controllers');
const middlewares = require('../middlewares');

router.get('/', routinesCtrl.getAll);

router.get('/:routineId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      executionTime: 'number',
    },
  });
}, routinesCtrl.create);

router.put('/:routineId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      executionTime: 'number',
    },
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.update);

router.delete('/:routineId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.delete);

router.post('/:routineId/exercise', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
      repetitions: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.addExercise);

router.delete('/:routineId/exercise', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.removeExercise);

router.patch('/:routineId/exercise', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
      repetitions: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.updateExerciseReps);

module.exports = router;
