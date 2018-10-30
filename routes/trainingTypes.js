const router = require('express').Router();
const { trainingTypesCtrl } = require('../controllers');
const { auth, validator, filter } = require('../middlewares');

router.get('/', (req, res, next) => {
  validator.validate(req, res, next, {
    query: {
      page: 'number',
      name: 'word',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  filter.validate(req, res, next, 'TrainingType');
}, trainingTypesCtrl.getAll);

router.get('/:trainingTypeId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      trainingTypeId: 'number',
    },
  });
}, trainingTypesCtrl.get);

router.use('/', auth.haveSession,
  (req, res, next) => {
    auth.havePermission(req, res, next, 'manageTrainingTypes');
  });

router.post('/', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}], trainingTypesCtrl.create);

router.put('/:trainingTypeId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      trainingTypeId: 'number',
    },
    body: {
      name: 'word',
    },
  });
}], trainingTypesCtrl.update);

router.delete('/:trainingTypeId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      trainingTypeId: 'number',
    },
  });
}], trainingTypesCtrl.delete);

module.exports = router;
