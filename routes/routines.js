const router = require('express').Router();
const { routinesCtrl } = require('../controllers');

router.get('/', routinesCtrl.getAll);
router.get('/:routineId', routinesCtrl.get);
router.post('/', routinesCtrl.create);
router.put('/:routineId', routinesCtrl.update);
router.delete('/:routineId', routinesCtrl.delete);

router.get('/:routineId/exercises', routinesCtrl.getExercises);
router.post('/:routineId/exercises', routinesCtrl.addExercise);
router.delete('/:routineId/exercises/:exerciseId', routinesCtrl.removeExercise);

module.exports = router;
