const router = require('express').Router();
const { bodyPartsCtrl } = require('../controllers');
const mw = require('../middlewares');

router.get('/', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    query: {
      page: 'number',
      name: 'word',
      sort: 'word',
      order: 'order',
    },
  });
}, (req, res, next) => {
  mw.filter.validate(req, res, next, 'BodyPart');
}, bodyPartsCtrl.getAll);

router.get('/:bodyPartId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.get);

router.use('/', mw.auth.haveSession,
  (req, res, next) => {
    mw.auth.havePermission(req, res, next, 'manageBodyParts');
  });

router.post('/', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}, bodyPartsCtrl.create);

router.put('/:bodyPartId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.update);

router.delete('/:bodyPartId', (req, res, next) => {
  mw.validator.validate(req, res, next, {
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.delete);

module.exports = router;
