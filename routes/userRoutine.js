const router = require('express').Router();
const { userRoutineCtrl } = require('../controllers');

router.get('/', userRoutineCtrl.getAll);
// FIXME Falta validar los params :userRoutineId para confirmar que es un identificador valido
router.get('/:userRoutineId', userRoutineCtrl.get);
// FIXME Falta validar el cuerpo del request
router.post('/', userRoutineCtrl.create);
// FIXME Falta validar los params :userRoutineId para confirmar que es un identificador valido
// FIXME Falta validar el cuerpo del request
router.put('/:userRoutineId', userRoutineCtrl.update);
// FIXME Falta validar los params :userRoutineId para confirmar que es un identificador valido
router.delete('/:userRoutineId', userRoutineCtrl.delete);

module.exports = router;
