const router = require('express').Router();
const { calendaryDayExerciseCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', calendaryDayExerciseCtrl.getAll);
router.get('/:idcalendaryDayExercise', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcalendaryDayExercise: 'number',
  },
});
}, calendaryDayExerciseCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      idCalendary: 'number,required',
      Day:  'number,required',
      idExercise: 'number,required',
    },
  });
},calendaryDayExerciseCtrl.create);

router.put('/:idcalendaryDayExercise', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcalendaryDayExercise: 'number',
  },
  body:{
    idCalendary: 'number,required',
    Day:  'number,required',
    idExercise: 'number,required',
  },
});
},calendaryDayExerciseCtrl.update);

router.delete('/:idcalendaryDayExercise', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idcalendaryDayExercise: 'number',
  },
});
},calendaryDayExerciseCtrl.delete);

module.exports = router;
