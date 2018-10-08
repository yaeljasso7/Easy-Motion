const router = require('express').Router();
const { calendaryCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', CalendarysCtrl.getAll);
router.get('/:idCalendary', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendary: 'number',
  },
});
}, calendarysCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
},Ctrl.create);

router.put('/:idCalendary', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendary: 'number',
  },
  body:{
      name: 'require,word',
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


module.exports = router;
