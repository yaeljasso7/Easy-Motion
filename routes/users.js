const router = require('express').Router();
const { usersCtrl } = require('../controllers');
const middlewares = require('../middlewares');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', usersCtrl.getAll);
router.get('/:idUser', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idUser: 'number',
  },
});
}, usersCtrl.get);

router.post('/', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
    body: {
      name: 'word,required',
      mail: 'email,required',
      mobile: 'iscellphone',
      height: 'isHeight,required',
      weight: 'isWeight,required',
    },
  });
},usersCtrl.create);

router.put('/:idUser', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idUser: 'number',
  },
  body:{
      mobile: 'iscellphone',
      height: 'isHeight',
      weight: 'isWeight',
  },
});
},usersCtrl.update);

router.delete('/:idUser', (req,res,next) => {
  middlewares.validator.validate(req, res, next, {
  params: {
    idUser: 'number',
  },
});
},usersCtrl.delete);


router.post('/:idUser/calendarys', usersCtrl.addCalendary);
//router.put('/:idUser/routines', usersCtrl.replaceRoutine);
router.delete('/:idUser/calendarys', usersCtrl.removeCalendary);

router.get('/:idUser/progress', usersCtrl.getProgress);
router.post('/:idUser/progress', usersCtrl.addProgress);

module.exports = router;
