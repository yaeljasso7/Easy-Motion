const router = require('express').Router();
const { exercisesCtrl } = require('../controllers');

router.get('/', exercisesCtrl.getAll);
router.get('/:exerciseId', exercisesCtrl.get);
router.post('/', exercisesCtrl.create);
router.put('/', exercisesCtrl.update);
router.delete('/:exerciseId', exercisesCtrl.delete);

module.exports = router;
