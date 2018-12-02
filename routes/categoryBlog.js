const router = require('express').Router();
const { categoryBlogCtrl } = require('../controllers');
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
  filter.validate(req, res, next, 'categoryBlog');
}, categoryBlogCtrl.getAll);

router.get('/:categoryId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      categoryId: 'number',
    },
  });
}, categoryBlogCtrl.get);

// FIXME por claridad este use deberia estar al inicio antes que todas las rutas para dejar claro que todas pasan por este middleware
router.use('/', auth.haveSession,
  (req, res, next) => {
    auth.havePermission(req, res, next, 'manageCategoryBlogs');
  });

router.post('/', [(req, res, next) => {
  validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
}], categoryBlogCtrl.create);

router.put('/:categoryId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      categoryId: 'number',
    },
    body: {
      name: 'word,required',
    },
  });
}], categoryBlogCtrl.update);

router.delete('/:categoryId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      categoryId: 'number',
    },
  });
}], categoryBlogCtrl.delete);


module.exports = router;
