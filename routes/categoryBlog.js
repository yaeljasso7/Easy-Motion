const router = require('express').Router();
const { categoryBlogCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', categoryBlogCtrl.getAll);

router.get('/:idcategoryBlog', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcategoryBlog: 'number',
  },
});
},categoryBlogCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  body: {
    name: 'word,required',
  },
});
},categoryBlogCtrl.create);

router.put('/:idcategoryBlog', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
      idcategoryBlog: 'number',
    },
  body: {
    name: 'word,required',
  },
});
},categoryBlogCtrl.update);

router.delete('/:idcategoryBlog',(req,res,next) => {
    middlewares.validator.validate(req, res, next, {
    params: {
      idcategoryBlog: 'number',
    },
  });
},categoryBlogCtrl.delete);




module.exports = router;
