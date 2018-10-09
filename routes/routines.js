const router = require('express').Router();
const { routinesCtrl } = require('../controllers');
const middlewares = require('../middlewares');

router.get('/', routinesCtrl.getAll);
router.get('/:routineId', routinesCtrl.get);
router.post('/', routinesCtrl.create);
router.put('/:routineId', routinesCtrl.update);
router.delete('/:routineId', routinesCtrl.delete);

module.exports = router;
