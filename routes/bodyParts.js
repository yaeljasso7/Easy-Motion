const router = require('express').Router();
const { bodyPartsCtrl } = require('../controllers');

router.get('/', bodyPartsCtrl.getAll);
router.get('/:bodyPartId', bodyPartsCtrl.get);
router.post('/', bodyPartsCtrl.create);
router.put('/:bodyPartId', bodyPartsCtrl.update);
router.delete('/:bodyPartId', bodyPartsCtrl.delete);

module.exports = router;
