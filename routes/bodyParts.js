const router = require('express').Router();
const { bodyPartsCtrl } = require('../controllers');
const middlewares = require('../middlewares');

router.get('/', bodyPartsCtrl.getAll);

router.get('/:bodyPartId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}, bodyPartsCtrl.create);

router.put('/:bodyPartId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.update);

router.delete('/:bodyPartId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.delete);

module.exports = router;
