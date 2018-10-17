const router = require('express').Router();
const { calendarCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', calendarCtrl.getAll);
router.get('/:idCalendar', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendar: 'number',
  },
});
}, calendarCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
    },
  });
},calendarCtrl.create);

router.put('/:idCalendar', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendar: 'number',
  },
  body:{
      name: 'required,word',
  },
});
},calendarCtrl.update);

router.delete('/:idCalendar', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendar: 'number',
  },
});
},calendarCtrl.delete);

router.post('/:idCalendar/routines', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendar: 'number',
  },
  body:{
      idRoutine: 'required,number',
      day: 'required,number'
  },
});
},calendarCtrl.addRoutine);

router.delete('/:idCalendar/routines', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idCalendar: 'number',
  },
  body:{
      idRoutine: 'required,number',
      day: 'required,number'
  },
});
},calendarCtrl.removeRoutine);

module.exports = router;
