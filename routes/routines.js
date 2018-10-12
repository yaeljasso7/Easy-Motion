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
    },
  });
}, routinesCtrl.create);

router.put('/:routineId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
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

router.post('/:routineId/exercises', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.addExercise);

router.get('/:routineId/exercises', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.getExercises);

router.delete('/:routineId/exercises/:exerciseId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      routineId: 'number',
      exerciseId: 'number',
    },
  });
}, routinesCtrl.removeExercise);

module.exports = router;
