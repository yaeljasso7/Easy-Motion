const router = require('express').Router();
const { calendaryCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', calendaryCtrl.getAll);
router.get('/:idCalendary', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendary: 'number',
  },
});
}, calendaryCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
},calendaryCtrl.create);

router.put('/:idCalendary', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendary: 'number',
  },
  body:{
      name: 'required,word',
  },
});
},calendaryCtrl.update);

router.delete('/:idCalendary', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendary: 'number',
  },
});
},calendaryCtrl.delete);

router.post('/:idCalendary/routines', calendaryCtrl.addRoutine);
router.delete('/:idCalendary/routines', calendaryCtrl.removeRoutine);

module.exports = router;
