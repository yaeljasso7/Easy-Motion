const router = require('express').Router();
const { bodyPartsCtrl } = require('../controllers');
const { auth, validator } = require('../middlewares');

router.get('/', bodyPartsCtrl.getAll);

router.get('/:bodyPartId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.get);

router.use('/', auth.haveSession,
  (req, res, next) => {
    auth.havePermission(req, res, next, 'manageBodyParts');
  });

router.post('/', (req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}, bodyPartsCtrl.create);

router.put('/:bodyPartId', (req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.update);

router.delete('/:bodyPartId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      bodyPartId: 'number',
    },
  });
}, bodyPartsCtrl.delete);

module.exports = router;
