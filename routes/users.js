const express = require('express'); //llamar express
const router = express.Router(); //usando solo un modulo de express
const usersCtrl = require('../controllers/users');

//rutas
//request  /info relativa del cliente
//response /enviar cliente
//regresa usuarios todos
router.get('/', usersCtrl.getAllUsers);

//regresa solo un usuario
router.get('/:id', usersCtrl.getOneUser);

//crear //se necesita instalar body-parser
router.post('/', usersCtrl.createOneUser);

//modificar
router.put('/:id', usersCtrl.updateOneUser);

//eliminar
router.delete('/:id', usersCtrl.deleteOneUser);

module.exports = router;
