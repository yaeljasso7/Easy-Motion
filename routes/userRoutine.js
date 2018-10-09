const router = require('express').Router();
const { userRoutineCtrl } = require('../controllers');

router.get('/', userRoutineCtrl.getAll);
router.get('/:userRoutineId', userRoutineCtrl.get);
router.post('/', userRoutineCtrl.create);
router.put('/:userRoutineId', userRoutineCtrl.update);
router.delete('/:userRoutineId', userRoutineCtrl.delete);

module.exports = router;
