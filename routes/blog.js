const router = require('express').Router();
const { blogCtrl } = require('../controllers');
const middlewares = require('../middlewares');

router.get('/', blogCtrl.getAll);

router.get('/:blogId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      blogId: 'number',
    },
  });
}, blogCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      autor: 'word,required',
      data: 'required',
    },
  });
}, blogCtrl.create);

router.put('/:blogId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
    },
    params: {
      blogId: 'number',
    },
  });
}, blogCtrl.update);

router.delete('/:blogId', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
    params: {
      blogId: 'number',
    },
  });
}, blogCtrl.delete);

module.exports = router;
