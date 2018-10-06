const router = require('express').Router();
const { blogCtrl } = require('../controllers');


//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', blogCtrl.getAll);
router.get('/:idBlog', blogCtrl.get);
router.post('/', blogCtrl.create);
router.put('/:idBlog', blogCtrl.update);
router.delete('/:idBlog', blogCtrl.delete);


module.exports = router;
