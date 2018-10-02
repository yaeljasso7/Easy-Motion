const router = require('express').Router();
const { usersCtrl } = require('../controllers');


//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', usersCtrl.getAll);
router.get('/:idUser', usersCtrl.get);
router.post('/', usersCtrl.create);
router.put('/:idUser', usersCtrl.update);
router.delete('/:idUser', usersCtrl.delete);


module.exports = router;
