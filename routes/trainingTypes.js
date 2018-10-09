const router = require('express').Router();
const { trainingTypesCtrl } = require('../controllers');

router.get('/', trainingTypesCtrl.getAll);
router.get('/:trainingTypeId', trainingTypesCtrl.get);
router.post('/', trainingTypesCtrl.create);
router.put('/:trainingTypeId', trainingTypesCtrl.update);
router.delete('/:trainingTypeId', trainingTypesCtrl.delete);

module.exports = router;
