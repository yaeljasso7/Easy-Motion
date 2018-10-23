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

router.get('/:categoryBlogId', (req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      categoryId: 'number',
    },
  });
}, categoryBlogCtrl.get);

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

router.put('/:categoryBlogId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      categoryId: 'number',
    },
    body: {
      name: 'word,required',
    },
  });
}], categoryBlogCtrl.update);

router.delete('/:categoryBlogId', [(req, res, next) => {
  validator.validate(req, res, next, {
    params: {
      categoryId: 'number',
    },
  });
}], categoryBlogCtrl.delete);


module.exports = router;
