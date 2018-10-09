const router = require('express').Router();
const { exerciseOnRoutineCtrl } = require('../controllers');

router.get('/', exerciseOnRoutineCtrl.getAll);
router.get('/:idexerciseOnRoutine', exerciseOnRoutineCtrl.get);
router.post('/', exerciseOnRoutineCtrl.create);
router.put('/:idexerciseOnRoutine', exerciseOnRoutineCtrl.update);
router.delete('/:idexerciseOnRoutine', exerciseOnRoutineCtrl.delete);

module.exports = router;
