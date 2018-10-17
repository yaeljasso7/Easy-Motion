const router = require('express').Router();
const { calendarDayExerciseCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', calendarDayExerciseCtrl.getAll);
router.get('/:idcalendarDayExercise', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcalendarDayExercise: 'number',
  },
});
}, calendarDayExerciseCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      idCalendar: 'number,required',
      Day:  'number,required',
      idExercise: 'number,required',
    },
  });
},calendarDayExerciseCtrl.create);

router.put('/:idcalendarDayExercise', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcalendarDayExercise: 'number',
  },
  body:{
    idCalendar: 'number,required',
    Day:  'number,required',
    idExercise: 'number,required',
  },
});
},calendarDayExerciseCtrl.update);

router.delete('/:idcalendarDayExercise', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcalendarDayExercise: 'number',
  },
});
},calendarDayExerciseCtrl.delete);

module.exports = router;
