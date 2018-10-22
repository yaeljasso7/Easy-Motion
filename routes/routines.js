const router = require('express').Router();
const { routinesCtrl } = require('../controllers');
const { auth, reference, validator } = require('../middlewares');

router.get('/', routinesCtrl.getAll);

router.get('/:routineId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      routineId: 'number',
    },
  });
}, routinesCtrl.get);

router.use('/', auth.haveSession,
  (req, res, next) => {
    auth.havePermission(req, res, next, 'manageRoutines');
  });

router.post('/', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      executionTime: 'number',
    },
  });
}], routinesCtrl.create);

router.put('/:routineId', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      executionTime: 'number',
    },
    params: {
      routineId: 'number',
    },
  });
}], routinesCtrl.update);

router.delete('/:routineId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      routineId: 'number',
    },
  });
}], routinesCtrl.delete);

router.post('/:routineId/exercise', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
      repetitions: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, (req, res, next) => {
  reference.validate(req, res, next, {
    body: {
      exerciseId: 'Exercise',
    },
  });
}], routinesCtrl.addExercise);

router.delete('/:routineId/exercise', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, (req, res, next) => {
  reference.validate(req, res, next, {
    body: {
      exerciseId: 'Exercise',
    },
  });
}], routinesCtrl.removeExercise);

router.patch('/:routineId/exercise', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      exerciseId: 'number,required',
      repetitions: 'number,required',
    },
    params: {
      routineId: 'number',
    },
  });
}, (req, res, next) => {
  reference.validate(req, res, next, {
    body: {
      exerciseId: 'Exercise',
    },
  });
}], routinesCtrl.updateExerciseReps);

module.exports = router;
