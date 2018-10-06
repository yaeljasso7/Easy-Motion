const router = require('express').Router();
const { categoryBlogCtrl } = require('../controllers');


//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', categoryBlogCtrl.getAll);
router.get('/:idcategoryBlog', categoryBlogCtrl.get);
router.post('/', categoryBlogCtrl.create);
router.put('/:idcategoryBlog', categoryBlogCtrl.update);
router.delete('/:idcategoryBlog', categoryBlogCtrl.delete);


module.exports = router;
