const router = require('express').Router();
const { blogCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', blogCtrl.getAll);

router.get('/:idBlog', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idBlog: 'number',
  },
  });
},blogCtrl.get);

router.post('/', (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
  body: {
      autor: 'word,required',
      data: 'required',
    },
  });
},blogCtrl.create);

router.put('/:idBlog',  (req, res, next) => {
  middlewares.validator.validate(req, res, next, {
  body: {
      autor: 'word,required',
      data: 'required',
    },
  params: {
        idBlog: 'number',
      },
  });
},blogCtrl.update);

router.delete('/:idBlog', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idBlog: 'number',
  },
});
},blogCtrl.delete);




module.exports = router;
